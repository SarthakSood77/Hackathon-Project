from fastapi import APIRouter, UploadFile, File, HTTPException, status
import logging
from app.schemas.common import ApiResponse
from app.schemas.face import FaceVerificationResult
from app.services.face_service import FaceService

router = APIRouter(prefix="/face", tags=["Module 4: Face Verification"])
logger = logging.getLogger("border_guard.api.face")

@router.post("/verify", response_model=ApiResponse[FaceVerificationResult], summary="1:1 Biometric Face Match between document photo and live traveler camera capture")
async def verify_identity_face(
    document_image: UploadFile = File(..., description="Passport or ID document containing the photo"),
    live_face_image: UploadFile = File(..., description="Live camera snapshot of traveler at border e-Gate")
):
    """
    **Module 4: Facial Biometric Verification**
    
    Ensures document owner matches the presented traveler:
    - Automatically isolates and crops face from document
    - Detects face from live checkpoint camera feed
    - Computes 1:1 biometric embedding similarity and distance
    - Performs anti-spoofing / liveness texture assessment
    """
    if not document_image.content_type.startswith("image/") or not live_face_image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both files must be valid image formats."
        )
        
    doc_bytes = await document_image.read()
    live_bytes = await live_face_image.read()
    
    face_result = FaceService.verify_faces(doc_bytes, live_bytes)
    
    return ApiResponse(
        success=True,
        message="Face verification analysis completed.",
        data=face_result
    )
