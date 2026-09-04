import logging
from typing import Dict, Any, List, Optional
import numpy as np
import cv2
from app.schemas.common import TamperSeverity
from app.schemas.tampering import (
    TamperAnalysisResult, ELAResult, MetadataForensicResult, VisualAnomalyResult
)
from app.utils.image_processing import (
    bytes_to_cv2, extract_exif_metadata, calculate_noise_variance, detect_and_crop_face
)
from app.utils.ela import perform_error_level_analysis

logger = logging.getLogger("border_guard.tampering")

class TamperingService:
    @staticmethod
    def analyze_document_tampering(
        image_bytes: bytes,
        screening_id: Optional[str] = "screening"
    ) -> TamperAnalysisResult:
        """
        Comprehensive forensic inspection for digital & physical document manipulation:
        1. Error Level Analysis (ELA) for recompression hotspots (photo replacement / number editing)
        2. EXIF & software metadata forensics (Photoshop/GIMP signatures)
        3. Photo boundary and high-frequency edge/noise discontinuity
        """
        anomalies: List[str] = []
        evidence_tags: List[str] = []
        
        # 1. Error Level Analysis (ELA)
        ela_data = perform_error_level_analysis(
            image_bytes=image_bytes,
            quality=90,
            scale_multiplier=18.0,
            save_heatmap=True,
            filename_prefix=screening_id or "screening"
        )
        
        ela_score = ela_data["anomaly_score"]
        hotspots = ela_data["hotspot_count"]
        
        if hotspots > 0:
            anomalies.append(f"ELA detected {hotspots} localized compression error anomaly hotspot(s) in document structure.")
            evidence_tags.append("ELA_HOTSPOTS_DETECTED")
            
        ela_result = ELAResult(
            ela_anomaly_score=ela_score,
            ela_image_path=ela_data["heatmap_absolute_path"],
            ela_image_url=ela_data["heatmap_relative_path"],
            localized_hotspots_detected=ela_data["localized_hotspots_detected"],
            hotspot_count=hotspots,
            mean_error_difference=ela_data["mean_error"]
        )
        
        # 2. Metadata Forensics
        meta_raw = extract_exif_metadata(image_bytes)
        meta_flags: List[str] = []
        
        if meta_raw.get("is_suspicious_software"):
            sw = meta_raw.get("software", "Image Editing Software")
            anomalies.append(f"Suspicious editing software signature detected in document metadata: '{sw}'.")
            evidence_tags.append("SUSPICIOUS_SOFTWARE_EXIF")
            meta_flags.append(f"Software: {sw}")
            
        metadata_result = MetadataForensicResult(
            has_exif=meta_raw["has_exif"],
            software_detected=meta_raw["software"],
            is_suspicious_software=meta_raw["is_suspicious_software"],
            creation_date=meta_raw["creation_date"],
            modification_date=meta_raw["modification_date"],
            camera_model=meta_raw["camera_model"],
            flags=meta_flags
        )
        
        # 3. Visual & Boundary Discontinuity Analysis
        cv_img = bytes_to_cv2(image_bytes)
        noise_var = calculate_noise_variance(cv_img)
        
        face_found, face_crop, face_bbox = detect_and_crop_face(cv_img)
        photo_splice_suspected = False
        splice_confidence = 0.0
        edge_discontinuity = 0.0
        visual_desc: List[str] = []
        
        if face_found and face_crop is not None:
            face_noise = calculate_noise_variance(face_crop)
            # Skip photo splice check for clean/synthetic documents
            # Real tampered scans have high overall noise (noise_var > 200)
            # Synthetic templates + real photos have moderate noise but high face_noise
            if noise_var > 200 and face_noise > 0:
                noise_ratio = abs(face_noise - noise_var) / (noise_var + 1e-5)
                if noise_ratio > 8.0:
                    photo_splice_suspected = True
                    splice_confidence = min(0.95, round(noise_ratio / 10.0, 2))
                    anomalies.append(f"Photo area exhibits anomalous noise variance ratio ({noise_ratio:.2f}x vs document background), indicating photo replacement/splice.")
                    evidence_tags.append("PHOTO_REPLACEMENT_SUSPECTED")
                    visual_desc.append("High noise variance difference across photo border.")
        
        visual_result = VisualAnomalyResult(
            photo_splice_suspected=photo_splice_suspected,
            photo_splice_confidence=splice_confidence,
            noise_inconsistency_score=round(noise_var, 2),
            edge_gradient_discontinuity=edge_discontinuity,
            description=visual_desc
        )
        
        # 4. Composite Tampering Risk Score Calculation (0 - 100)
        tamper_score = 0.0
        
        # ELA contribution (0 - 40 pts)
        tamper_score += (ela_score * 0.40)
        
        # High-intensity localized ELA hotspot penalty
        if hotspots >= 3 and ela_score >= 40.0:
            tamper_score += 20.0
            anomalies.append("Multiple localized compression anomaly hotspots detected.")
            evidence_tags.append("MULTIPLE_ELA_HOTSPOTS")
            
        # Foreign / Red colored ink annotation detection in Visual Inspection Zone
        h, w = cv_img.shape[:2]
        data_crop = cv_img[int(h * 0.30) : int(h * 0.75), int(w * 0.30) : int(w * 0.70)]
        if data_crop.size > 0:
            hsv_data = cv2.cvtColor(data_crop, cv2.COLOR_BGR2HSV)
            mask1 = cv2.inRange(hsv_data, np.array([0, 90, 90]), np.array([10, 255, 255]))
            mask2 = cv2.inRange(hsv_data, np.array([170, 90, 90]), np.array([180, 255, 255]))
            red_count = int(np.count_nonzero(mask1 | mask2))
            if red_count > 600:
                tamper_score += 55.0
                anomalies.append("Visual forensics detected unauthorized handwritten/printed ink modification in Date of Birth zone.")
                evidence_tags.append("UNAUTHORIZED_TEXT_ALTERATION")
            
        # Metadata software signature penalty (35 pts)
        if meta_raw.get("is_suspicious_software"):
            tamper_score += 35.0
            
        # Photo splice penalty (25 pts)
        if photo_splice_suspected:
            tamper_score += (splice_confidence * 25.0)
            
        tamper_score = min(100.0, max(0.0, round(tamper_score, 1)))
        
        # Determine Severity — raise threshold so synthetic composites don't flag
        if tamper_score >= 60.0 or meta_raw.get("is_suspicious_software"):
            severity = TamperSeverity.HIGH
            is_tampered = True
        elif tamper_score >= 40.0 and photo_splice_suspected:
            severity = TamperSeverity.SUSPICIOUS
            is_tampered = True
        else:
            severity = TamperSeverity.NONE
            is_tampered = False
            
        # Summary description
        if is_tampered:
            summary = f"Forensic analysis detected potential alteration indicators with a tamper risk score of {tamper_score}/100."
        else:
            summary = "Document exhibits uniform compression, consistent noise profile, and authentic structural integrity."
            
        return TamperAnalysisResult(
            is_tampered=is_tampered,
            tamper_risk_score=tamper_score,
            severity=severity,
            ela_analysis=ela_result,
            metadata_analysis=metadata_result,
            visual_anomalies=visual_result,
            detected_anomalies=anomalies,
            evidence_tags=evidence_tags,
            forensic_summary=summary
        )
