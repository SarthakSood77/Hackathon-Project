from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from app.schemas.common import DocumentType, ScreeningStatus, RiskLevel
from app.schemas.ocr import OCRExtractionResult
from app.schemas.validation import DocumentValidationResult
from app.schemas.tampering import TamperAnalysisResult
from app.schemas.face import FaceVerificationResult

class RiskComponentScore(BaseModel):
    component_name: str
    weight: float
    raw_risk: float = Field(ge=0.0, le=100.0)
    weighted_contribution: float

class ScreeningDecision(BaseModel):
    screening_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: ScreeningStatus
    risk_score: float = Field(ge=0.0, le=100.0)
    risk_level: RiskLevel
    processing_time_ms: float
    
    # Document Info
    document_type: DocumentType
    document_number: Optional[str] = None
    holder_name: Optional[str] = None
    nationality: Optional[str] = None
    
    # Detailed Modules Outputs
    ocr_result: OCRExtractionResult
    validation_result: DocumentValidationResult
    tampering_result: TamperAnalysisResult
    face_result: Optional[FaceVerificationResult] = None
    
    # Explainable Risk Breakdown
    risk_components: List[RiskComponentScore] = []
    risk_factors: List[str] = []
    recommended_action: str
    
    # Digital Audit Trail & Metadata
    checkpoint_id: str = "GATE-01-MAIN"
    officer_id: str = "AI-SYSTEM"
    document_image_path: Optional[str] = None
    live_face_image_path: Optional[str] = None
    ela_heatmap_url: Optional[str] = None

class ScreeningFilter(BaseModel):
    status: Optional[ScreeningStatus] = None
    risk_level: Optional[RiskLevel] = None
    document_type: Optional[DocumentType] = None
    document_number: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 50
    skip: int = 0
