from typing import Optional, List
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class FaceVerificationResult(BaseModel):
    face_detected_in_doc: bool = False
    face_detected_in_live: bool = False
    doc_face_box: Optional[BoundingBox] = None
    live_face_box: Optional[BoundingBox] = None
    
    # Biometric Matching Scores
    similarity_score: float = Field(ge=0.0, le=1.0, description="1.0 is exact match, 0.0 is completely different individual")
    euclidean_distance: float = 0.0
    match_status: str = "MATCH"  # MATCH, PROBABLE_MATCH, MISMATCH, NO_FACE_DETECTED
    verification_passed: bool = True
    
    # Anti-spoofing / Liveness Heuristics
    liveness_score: float = Field(default=0.95, ge=0.0, le=1.0)
    is_live_person: bool = True
    
    details: str = "Facial biometrics match within acceptable confidence threshold."
