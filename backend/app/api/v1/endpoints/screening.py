import time
import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Query
from fastapi.responses import FileResponse
from typing import Optional, List
import logging
from app.config import settings
from app.schemas.common import ApiResponse, DocumentType, ScreeningStatus, RiskLevel
from app.schemas.screening import ScreeningDecision
from app.services.ocr_service import OCRService
from app.services.tampering_service import TamperingService
from app.services.face_service import FaceService
from app.services.validation_service import ValidationService
from app.services.risk_engine import RiskEngine
from app.core.database import get_collection

router = APIRouter(prefix="/screen", tags=["End-to-End Screening & Audit Records"])
logger = logging.getLogger("border_guard.api.screening")

from app.utils.image_processing import ensure_image_bytes

@router.post("/full", response_model=ApiResponse[ScreeningDecision], summary="Complete 360-degree Border Document Screening & Risk Assessment")
async def screen_document_full(
    document_image: UploadFile = File(..., description="Identity document photo (Passport, Visa, ID, License)"),
    live_face_image: Optional[UploadFile] = File(None, description="Optional live traveler selfie captured at checkpoint e-Gate"),
    hint_document_type: Optional[DocumentType] = Form(None, description="Optional document hint"),
    checkpoint_id: str = Form("GATE-01-MAIN", description="Border checkpoint ID / E-Gate terminal identifier"),
    officer_id: str = Form("AI-SYSTEM", description="Operating border officer ID")
):
    """
    **Complete AI-Powered Document Screening Pipeline**
    
    Executes the entire border screening workflow in a single sub-second request:
    1. **Module 1**: OCR Extraction & ICAO 9303 MRZ parsing
    2. **Module 2**: Validation (Modulo-10 checksums, expiration dates, watchlist lookup)
    3. **Module 3**: Digital & Physical Tampering Forensics (Error Level Analysis ELA, EXIF, photo splice)
    4. **Module 4**: 1:1 Facial Biometric Verification & Liveness check (if selfie provided)
    5. **Risk Engine**: Generates 0-100 composite risk score, explainable breakdown, and clearance decision.
    6. **Digital Audit Trail**: Automatically persists record in MongoDB.
    """
    start_time = time.perf_counter()
    
    raw_doc_bytes = await document_image.read()
    if not raw_doc_bytes or len(raw_doc_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document file is empty. Please upload a valid document."
        )
        
    try:
        doc_bytes = ensure_image_bytes(
            raw_doc_bytes,
            filename=document_image.filename or "",
            content_type=document_image.content_type or ""
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unable to process document. Please upload a clear image (JPG, PNG) or PDF. ({str(e)})"
        )
        
    live_bytes = None
    if live_face_image:
        raw_live_bytes = await live_face_image.read()
        if raw_live_bytes and len(raw_live_bytes) > 0:
            try:
                live_bytes = ensure_image_bytes(
                    raw_live_bytes,
                    filename=live_face_image.filename or "",
                    content_type=live_face_image.content_type or ""
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unable to process traveller selfie. Please upload a clear photo. ({str(e)})"
                )
        
    # Save uploaded document image for digital audit log
    doc_filename = f"doc_{uuid.uuid4().hex[:10]}.jpg"
    doc_save_path = settings.UPLOAD_DIR / doc_filename
    with open(doc_save_path, "wb") as f:
        f.write(doc_bytes)
        
    live_filename = None
    if live_bytes:
        live_filename = f"live_{uuid.uuid4().hex[:10]}.jpg"
        live_save_path = settings.UPLOAD_DIR / live_filename
        with open(live_save_path, "wb") as f:
            f.write(live_bytes)
            
    # Step 1: OCR Extraction
    ocr_result = OCRService.extract_document_data(
        image_bytes=doc_bytes,
        hint_doc_type=hint_document_type
    )
    
    # Step 2: Tampering & Forensics
    tampering_result = TamperingService.analyze_document_tampering(
        image_bytes=doc_bytes,
        screening_id=f"screen_{uuid.uuid4().hex[:8]}"
    )
    
    # Step 3: Face Verification (if live image provided)
    face_result = None
    if live_bytes:
        face_result = FaceService.verify_faces(
            doc_image_bytes=doc_bytes,
            live_image_bytes=live_bytes
        )
        
    # Step 4: Rule Validation & Watchlist Match
    validation_result = await ValidationService.validate_document(ocr_result)
    
    # Step 5: Risk Engine & Decision
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
    
    decision = RiskEngine.calculate_screening_decision(
        ocr_result=ocr_result,
        validation_result=validation_result,
        tampering_result=tampering_result,
        face_result=face_result,
        checkpoint_id=checkpoint_id,
        officer_id=officer_id,
        processing_time_ms=elapsed_ms,
        doc_image_path=str(doc_save_path),
        live_image_path=str(live_save_path) if live_filename else None
    )
    
    # Step 6: Persist in MongoDB Audit Trail
    try:
        screenings_col = get_collection("screenings")
        doc_record = decision.model_dump(mode="json")
        doc_record["_id"] = decision.screening_id
        await screenings_col.insert_one(doc_record)
    except Exception as e:
        logger.error(f"Failed to persist screening to database: {e}")
        
    return ApiResponse(
        success=True,
        message=f"Screening complete: Status is {decision.status.value} (Risk Score: {decision.risk_score}/100)",
        data=decision
    )

@router.get("/records", response_model=ApiResponse[List[ScreeningDecision]], summary="List screening records and digital audit logs")
async def list_screenings(
    status: Optional[ScreeningStatus] = Query(None, description="Filter by status (CLEARED, MANUAL_REVIEW, REJECTED_HIGH_RISK)"),
    risk_level: Optional[RiskLevel] = Query(None, description="Filter by risk level"),
    document_type: Optional[DocumentType] = Query(None, description="Filter by document type"),
    document_number: Optional[str] = Query(None, description="Filter by document number"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0)
):
    """Retrieves digital audit logs of all processed border screenings with filtering."""
    query = {}
    if status:
        query["status"] = status.value
    if risk_level:
        query["risk_level"] = risk_level.value
    if document_type:
        query["document_type"] = document_type.value
    if document_number:
        query["document_number"] = {"$regex": document_number.strip(), "$options": "i"}
        
    screenings_col = get_collection("screenings")
    cursor = screenings_col.find(query).sort("timestamp", -1).skip(skip).limit(limit)
    items = await cursor.to_list(length=limit)
    
    decisions = [ScreeningDecision(**item) for item in items]
    return ApiResponse(
        success=True,
        message=f"Retrieved {len(decisions)} screening records.",
        data=decisions
    )

@router.get("/records/{screening_id}", response_model=ApiResponse[ScreeningDecision], summary="Get full investigation report by screening ID")
async def get_screening_by_id(screening_id: str):
    """Retrieves full forensic screening report by screening ID."""
    screenings_col = get_collection("screenings")
    record = await screenings_col.find_one({"_id": screening_id})
    if not record:
        record = await screenings_col.find_one({"screening_id": screening_id})
        
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Screening record not found.")
        
    return ApiResponse(
        success=True,
        message="Screening record retrieved successfully.",
        data=ScreeningDecision(**record)
    )

@router.get("/records/{screening_id}/ela", summary="Retrieve visual Error Level Analysis forensic heatmap")
async def get_ela_image(screening_id: str):
    """Serves the generated ELA forensic heatmap image for judge demo or UI presentation."""
    screenings_col = get_collection("screenings")
    record = await screenings_col.find_one({"_id": screening_id})
    if not record:
        record = await screenings_col.find_one({"screening_id": screening_id})
        
    if not record or "tampering_result" not in record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Screening record not found.")
        
    ela_path_str = record["tampering_result"].get("ela_analysis", {}).get("ela_image_path")
    if not ela_path_str or not os.path.exists(ela_path_str):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ELA heatmap image not found on disk.")
        
    return FileResponse(path=ela_path_str, media_type="image/jpeg")
