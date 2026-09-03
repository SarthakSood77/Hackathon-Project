import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import logging
from app.config import settings
from app.schemas.common import DocumentType, ScreeningStatus, RiskLevel
from app.schemas.ocr import OCRExtractionResult
from app.schemas.validation import DocumentValidationResult
from app.schemas.tampering import TamperAnalysisResult
from app.schemas.face import FaceVerificationResult
from app.schemas.screening import ScreeningDecision, RiskComponentScore

logger = logging.getLogger("border_guard.risk_engine")

class RiskEngine:
    @staticmethod
    def calculate_screening_decision(
        ocr_result: OCRExtractionResult,
        validation_result: DocumentValidationResult,
        tampering_result: TamperAnalysisResult,
        face_result: Optional[FaceVerificationResult] = None,
        checkpoint_id: str = "GATE-01-MAIN",
        officer_id: str = "AI-SYSTEM",
        processing_time_ms: float = 250.0,
        doc_image_path: Optional[str] = None,
        live_image_path: Optional[str] = None
    ) -> ScreeningDecision:
        """
        Computes composite multi-factor risk score (0-100), explainable risk components,
        and assigns official clearance status (CLEARED, MANUAL_REVIEW, REJECTED_HIGH_RISK).
        """
        screening_id = f"SEN-2026-{uuid.uuid4().hex[:6].upper()}"
        risk_components: List[RiskComponentScore] = []
        risk_factors: List[str] = []
        
        # --- Component 1: MRZ & Checksum Risk (Weight: 25%) ---
        mrz_risk = 0.0
        if not validation_result.mrz_checksum_passed:
            mrz_risk += 80.0
            risk_factors.append("MRZ Modulo 10 Checksum verification failure detected.")
        if not ocr_result.mrz_detected and ocr_result.document_type == DocumentType.PASSPORT:
            mrz_risk += 50.0
            risk_factors.append("Expected Machine Readable Zone (MRZ) missing from passport scan.")
            
        mrz_risk = min(100.0, mrz_risk)
        w_mrz = settings.WEIGHT_MRZ_CHECKSUM
        risk_components.append(RiskComponentScore(
            component_name="MRZ Standard & Checksums",
            weight=w_mrz,
            raw_risk=round(mrz_risk, 1),
            weighted_contribution=round(mrz_risk * w_mrz, 1)
        ))
        
        # --- Component 2: Tampering & Digital Forensics (Weight: 35%) ---
        tamper_risk = tampering_result.tamper_risk_score
        if tampering_result.is_tampered:
            tamper_risk = max(75.0, tamper_risk)
            for anomaly in tampering_result.detected_anomalies:
                if anomaly not in risk_factors:
                    risk_factors.append(anomaly)
                
        w_tamper = settings.WEIGHT_TAMPERING_ELA
        risk_components.append(RiskComponentScore(
            component_name="Digital Forensics & ELA Tampering",
            weight=w_tamper,
            raw_risk=round(tamper_risk, 1),
            weighted_contribution=round(tamper_risk * w_tamper, 1)
        ))
        
        # --- Component 3: Biometric Face Verification (Weight: 25%) ---
        face_risk = 0.0
        w_face = settings.WEIGHT_FACE_MATCH
        
        if face_result:
            if tampering_result.is_tampered:
                # If document is tampered or photo is modified, biometric credential cannot be certified
                face_result.verification_passed = False
                face_result.match_status = "PHOTO_TAMPERING_DETECTED"
                face_result.details = f"Biometric Verification Invalidated: Document photo and identity data compromised by forensic tampering (Tamper Score: {tampering_result.tamper_risk_score}/100)."
                face_risk = 85.0
                risk_factors.append("Biometric Invalidation: Facial match cannot be cleared on an altered/tampered document.")
            elif not face_result.verification_passed:
                face_risk = 90.0
                risk_factors.append(f"Facial Biometric Mismatch: Live passenger does not match ID photo ({face_result.similarity_score * 100:.1f}% match).")
            elif face_result.match_status == "PROBABLE_MATCH":
                face_risk = 35.0
                risk_factors.append(f"Moderate Facial Similarity ({face_result.similarity_score * 100:.1f}%): Secondary visual check advised.")
            else:
                face_risk = max(0.0, (1.0 - face_result.similarity_score) * 20.0)
                
            if not face_result.is_live_person:
                face_risk = 100.0
                risk_factors.append("Anti-Spoofing Alert: Live camera feed shows signs of presentation attack / photo spoofing.")
        else:
            # If no live face provided, default to neutral 0 face risk
            face_risk = 0.0
            
        risk_components.append(RiskComponentScore(
            component_name="Facial Biometric Verification",
            weight=w_face,
            raw_risk=round(face_risk, 1),
            weighted_contribution=round(face_risk * w_face, 1)
        ))
        
        # --- Component 4: Document Expiry & Date Rules (Weight: 15%) ---
        date_risk = 0.0
        if validation_result.is_expired:
            date_risk = 100.0
            risk_factors.append("Travel Document is expired and invalid for border entry.")
        elif validation_result.days_until_expiry is not None and validation_result.days_until_expiry < 180:
            date_risk = 30.0
            risk_factors.append(f"Document expires within 6 months ({validation_result.days_until_expiry} days remaining).")
            
        if not validation_result.dob_valid:
            date_risk = max(date_risk, 80.0)
            risk_factors.append("Date of Birth logic failure (anomalous age calculated or registry mismatch).")
            
        w_date = settings.WEIGHT_EXPIRY_DATE
        risk_components.append(RiskComponentScore(
            component_name="Validity Period & Logical Rules",
            weight=w_date,
            raw_risk=round(date_risk, 1),
            weighted_contribution=round(date_risk * w_date, 1)
        ))
        
        # --- Composite Risk Calculation ---
        composite_score = sum(c.weighted_contribution for c in risk_components)
        
        # --- Tampering / Forgery Critical Elevation ---
        if tampering_result.is_tampered:
            composite_score = max(composite_score, 78.0)
            if not validation_result.mrz_checksum_passed or not validation_result.dob_valid:
                composite_score = max(composite_score, 82.0)
            if "CRITICAL FORENSIC ALERT: Unauthorized document tampering or date alteration detected." not in risk_factors:
                risk_factors.insert(0, "CRITICAL FORENSIC ALERT: Unauthorized document tampering or date alteration detected.")

        # --- Biometric Mismatch / Impostor Critical Elevation ---
        if face_result and not face_result.verification_passed:
            composite_score = max(composite_score, 78.0)

        # --- Watchlist Override ---
        if validation_result.watchlist_hit:
            composite_score = 100.0
            risk_factors.insert(0, f"CRITICAL WATCHLIST HIT: {validation_result.watchlist_reason or 'Flagged Document/Person'}")
            
        final_risk = min(100.0, max(0.0, round(composite_score, 1)))
        
        # --- Decision Assignment ---
        if final_risk <= settings.LOW_RISK_THRESHOLD and not validation_result.is_expired and not validation_result.watchlist_hit and not tampering_result.is_tampered:
            status = ScreeningStatus.CLEARED
            risk_level = RiskLevel.LOW
            action = "Primary Automated Clearance Granted: Passenger cleared to proceed through e-Gates."
        elif final_risk <= settings.HIGH_RISK_THRESHOLD and not tampering_result.is_tampered:
            status = ScreeningStatus.MANUAL_REVIEW
            risk_level = RiskLevel.MEDIUM
            action = "Secondary Inspection Required: Officer must physically inspect passport laminate, verify stamps, and conduct verbal interview."
        else:
            status = ScreeningStatus.REJECTED_HIGH_RISK
            risk_level = RiskLevel.CRITICAL if validation_result.watchlist_hit or final_risk >= 85 else RiskLevel.HIGH
            action = "CRITICAL FRAUD / SECURITY ALERT: High risk of forged identity document or watchlist hit. Escort traveler for immediate border investigation."
            
        # Extract metadata identifiers
        doc_num = None
        holder_name = None
        nat = None
        
        if ocr_result.passport_fields:
            doc_num = ocr_result.passport_fields.passport_number
            holder_name = ocr_result.passport_fields.full_name
            nat = ocr_result.passport_fields.nationality
        elif ocr_result.visa_fields:
            doc_num = ocr_result.visa_fields.visa_number
            holder_name = ocr_result.visa_fields.holder_name
            nat = ocr_result.visa_fields.issuing_country
        elif ocr_result.national_id_fields:
            doc_num = ocr_result.national_id_fields.id_number
            holder_name = ocr_result.national_id_fields.full_name
            nat = ocr_result.national_id_fields.nationality
            
        return ScreeningDecision(
            screening_id=screening_id,
            timestamp=datetime.now(timezone.utc),
            status=status,
            risk_score=final_risk,
            risk_level=risk_level,
            processing_time_ms=round(processing_time_ms, 2),
            document_type=ocr_result.document_type,
            document_number=doc_num,
            holder_name=holder_name,
            nationality=nat,
            ocr_result=ocr_result,
            validation_result=validation_result,
            tampering_result=tampering_result,
            face_result=face_result,
            risk_components=risk_components,
            risk_factors=risk_factors,
            recommended_action=action,
            checkpoint_id=checkpoint_id,
            officer_id=officer_id,
            document_image_path=doc_image_path,
            live_face_image_path=live_image_path,
            ela_heatmap_url=tampering_result.ela_analysis.ela_image_url
        )
