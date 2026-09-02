from fastapi import APIRouter, UploadFile, File, HTTPException, status
import logging
from app.schemas.common import ApiResponse
from app.schemas.tampering import TamperAnalysisResult
from app.services.tampering_service import TamperingService

router = APIRouter(prefix="/tampering", tags=["Module 3: Tampering Detection (Core AI Innovation)"])
logger = logging.getLogger("border_guard.api.tampering")

@router.post("/analyze", response_model=ApiResponse[TamperAnalysisResult], summary="Detect photo replacement, text alteration, stamp forgery, and EXIF manipulation")
async def analyze_tampering(
    document_image: UploadFile = File(..., description="Document image to analyze for physical/digital tampering")
):
    """
    **Module 3: Tampering Detection Engine (Core AI Innovation)**
    
    Detects digitally or physically altered documents:
    - **Error Level Analysis (ELA)**: Localized recompression differences exposing spliced photos/digits
    - **Metadata / EXIF Forensics**: Detects Photoshop, GIMP, Canva, and software traces
    - **Photo Replacement / Splice Detection**: Edge gradient and noise variance discontinuity
    - **Stamp & Text Alterations**: Identifies suspicious localized hotspot clusters
    """
    if not document_image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a valid image format (JPEG, PNG, WEBP, etc.)"
        )
        
    image_bytes = await document_image.read()
    tamper_result = TamperingService.analyze_document_tampering(
        image_bytes=image_bytes,
        screening_id="standalone_tamper"
    )
    
    return ApiResponse(
        success=True,
        message="Tamper analysis completed.",
        data=tamper_result
    )
