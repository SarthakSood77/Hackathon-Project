from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
import logging
from app.schemas.common import ApiResponse, DocumentType
from app.schemas.validation import DocumentValidationResult
from app.services.ocr_service import OCRService
from app.services.validation_service import ValidationService

router = APIRouter(prefix="/validation", tags=["Module 2: Document Validation"])
logger = logging.getLogger("border_guard.api.validation")

@router.post("/verify", response_model=ApiResponse[DocumentValidationResult], summary="Verify document standards, MRZ checksums, and watchlist")
async def verify_document_rules(
    document_image: UploadFile = File(..., description="Image of passport, visa, national ID"),
    hint_document_type: Optional[DocumentType] = Form(None)
):
    """
    **Module 2: Document Validation Engine**
    
    Verifies whether the document complies with official border standards:
    - **MRZ Modulo 10 Checksums**: Validates Document Number, DOB, and Expiration digits
    - **Document Expiration**: Verifies stay authorization and 6-month validity rules
    - **Date Logic**: Audits age sanity and issue vs expiry sequence
    - **Watchlist & Blacklist Lookup**: Queries Interpol and stolen travel document databases
    """
    if not document_image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a valid image format (JPEG, PNG, WEBP, etc.)"
        )
        
    image_bytes = await document_image.read()
    ocr_result = OCRService.extract_document_data(image_bytes, hint_doc_type=hint_document_type)
    validation_result = await ValidationService.validate_document(ocr_result)
    
    return ApiResponse(
        success=True,
        message="Document validation checks completed.",
        data=validation_result
    )
