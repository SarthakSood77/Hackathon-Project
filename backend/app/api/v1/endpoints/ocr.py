from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
import logging
from app.schemas.common import ApiResponse, DocumentType
from app.schemas.ocr import OCRExtractionResult
from app.services.ocr_service import OCRService

router = APIRouter(prefix="/ocr", tags=["Module 1: OCR Extraction"])
logger = logging.getLogger("border_guard.api.ocr")

@router.post("/extract", response_model=ApiResponse[OCRExtractionResult], summary="Extract structured fields and MRZ from identity documents")
async def extract_document_fields(
    document_image: UploadFile = File(..., description="Image of passport, visa, national ID, or driving license"),
    hint_document_type: Optional[DocumentType] = Form(None, description="Optional document type hint (PASSPORT, VISA, NATIONAL_ID, etc.)")
):
    """
    **Module 1: OCR & MRZ Extraction**
    
    Accepts an identity document scan/photo and automatically extracts:
    - Standard ICAO 9303 Machine Readable Zone (MRZ)
    - Full Name, Given Names, Surname
    - Document Number & Check Digits
    - Nationality & Issuing State
    - Date of Birth & Expiration Date
    - Visa-specific fields (Type, Entries, Stay Duration)
    """
    if not document_image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a valid image format (JPEG, PNG, WEBP, etc.)"
        )
        
    image_bytes = await document_image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
        
    ocr_result = OCRService.extract_document_data(
        image_bytes=image_bytes,
        hint_doc_type=hint_document_type
    )
    
    return ApiResponse(
        success=True,
        message="Document OCR fields successfully extracted.",
        data=ocr_result
    )
