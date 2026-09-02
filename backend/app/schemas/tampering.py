from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.common import TamperSeverity

class MetadataForensicResult(BaseModel):
    has_exif: bool = False
    software_detected: Optional[str] = None
    is_suspicious_software: bool = False  # True if Photoshop, GIMP, Canva, etc.
    creation_date: Optional[str] = None
    modification_date: Optional[str] = None
    date_mismatch_detected: bool = False
    camera_model: Optional[str] = None
    flags: List[str] = []

class ELAResult(BaseModel):
    ela_anomaly_score: float = Field(ge=0.0, le=100.0, description="Higher score indicates localized recompression anomalies")
    ela_image_path: Optional[str] = None
    ela_image_url: Optional[str] = None
    localized_hotspots_detected: bool = False
    hotspot_count: int = 0
    mean_error_difference: float = 0.0

class VisualAnomalyResult(BaseModel):
    photo_splice_suspected: bool = False
    photo_splice_confidence: float = 0.0
    text_manipulation_suspected: bool = False
    stamp_forgery_suspected: bool = False
    noise_inconsistency_score: float = 0.0
    edge_gradient_discontinuity: float = 0.0
    description: List[str] = []

class TamperAnalysisResult(BaseModel):
    is_tampered: bool = False
    tamper_risk_score: float = Field(ge=0.0, le=100.0, description="Composite tampering risk (0 = pristine, 100 = blatant forgery)")
    severity: TamperSeverity = TamperSeverity.NONE
    ela_analysis: ELAResult
    metadata_analysis: MetadataForensicResult
    visual_anomalies: VisualAnomalyResult
    detected_anomalies: List[str] = []
    evidence_tags: List[str] = []
    forensic_summary: str = "Document exhibits uniform compression and authentic structure."
