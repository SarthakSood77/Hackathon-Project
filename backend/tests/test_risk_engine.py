import pytest
from app.schemas.common import DocumentType, ScreeningStatus, RiskLevel, TamperSeverity
from app.schemas.ocr import OCRExtractionResult, MRZData, PassportFields
from app.schemas.validation import DocumentValidationResult, RuleCheckResult
from app.schemas.tampering import TamperAnalysisResult, ELAResult, MetadataForensicResult, VisualAnomalyResult
from app.schemas.face import FaceVerificationResult
from app.services.risk_engine import RiskEngine

def test_risk_engine_clean_cleared_case():
    ocr_res = OCRExtractionResult(
        document_type=DocumentType.PASSPORT,
        mrz_detected=True,
        passport_fields=PassportFields(
            full_name="JOHN DOE",
            passport_number="P12345678",
            nationality="UTO",
            date_of_birth="1990-05-12",
            date_of_expiry="2032-05-12"
        )
    )
    
    val_res = DocumentValidationResult(
        is_valid=True,
        is_expired=False,
        mrz_checksum_passed=True,
        dob_valid=True,
        watchlist_hit=False
    )
    
    tamper_res = TamperAnalysisResult(
        is_tampered=False,
        tamper_risk_score=5.0,
        severity=TamperSeverity.NONE,
        ela_analysis=ELAResult(ela_anomaly_score=5.0),
        metadata_analysis=MetadataForensicResult(),
        visual_anomalies=VisualAnomalyResult()
    )
    
    face_res = FaceVerificationResult(
        similarity_score=0.92,
        verification_passed=True,
        is_live_person=True,
        match_status="MATCH"
    )
    
    decision = RiskEngine.calculate_screening_decision(
        ocr_result=ocr_res,
        validation_result=val_res,
        tampering_result=tamper_res,
        face_result=face_res
    )
    
    assert decision.status == ScreeningStatus.CLEARED
    assert decision.risk_score <= 25.0
    assert decision.risk_level == RiskLevel.LOW

def test_risk_engine_critical_watchlist_case():
    ocr_res = OCRExtractionResult(
        document_type=DocumentType.PASSPORT,
        mrz_detected=True
    )
    val_res = DocumentValidationResult(
        is_valid=False,
        watchlist_hit=True,
        watchlist_reason="INTERPOL_RED_NOTICE"
    )
    tamper_res = TamperAnalysisResult(
        is_tampered=False,
        tamper_risk_score=0.0,
        ela_analysis=ELAResult(ela_anomaly_score=0.0),
        metadata_analysis=MetadataForensicResult(),
        visual_anomalies=VisualAnomalyResult()
    )
    
    decision = RiskEngine.calculate_screening_decision(
        ocr_result=ocr_res,
        validation_result=val_res,
        tampering_result=tamper_res
    )
    
    assert decision.status == ScreeningStatus.REJECTED_HIGH_RISK
    assert decision.risk_score == 100.0
    assert decision.risk_level == RiskLevel.CRITICAL
