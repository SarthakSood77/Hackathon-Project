import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
import logging
from app.schemas.common import ApiResponse
from app.schemas.watchlist import (
    WatchlistRecord, WatchlistCreate, WatchlistCheckQuery, WatchlistMatchResult
)
from app.core.database import get_collection

router = APIRouter(prefix="/watchlist", tags=["Watchlist & Blacklist Management"])
logger = logging.getLogger("border_guard.api.watchlist")

@router.get("", response_model=ApiResponse[List[WatchlistRecord]], summary="List all blacklisted documents and flagged individuals")
async def list_watchlist_records(
    flag_level: Optional[str] = Query(None, description="Filter by flag level (CRITICAL, HIGH, MEDIUM)"),
    reason: Optional[str] = Query(None, description="Filter by reason keyword"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0)
):
    query = {}
    if flag_level:
        query["flag_level"] = flag_level.upper()
    if reason:
        query["reason"] = {"$regex": reason, "$options": "i"}
        
    watchlist_col = get_collection("watchlists_blacklists")
    cursor = watchlist_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
    records = await cursor.to_list(length=limit)
    
    result = [WatchlistRecord(**r) for r in records]
    return ApiResponse(
        success=True,
        message=f"Retrieved {len(result)} watchlist records.",
        data=result
    )

@router.post("", response_model=ApiResponse[WatchlistRecord], status_code=status.HTTP_201_CREATED, summary="Add a document number or individual to border blacklist")
async def create_watchlist_entry(entry: WatchlistCreate):
    watchlist_col = get_collection("watchlists_blacklists")
    
    doc = entry.model_dump()
    doc["_id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc)
    
    if doc.get("document_number"):
        doc["document_number"] = doc["document_number"].upper().strip()
    if doc.get("full_name"):
        doc["full_name"] = doc["full_name"].strip()
        
    await watchlist_col.insert_one(doc)
    
    return ApiResponse(
        success=True,
        message="Watchlist entry registered successfully.",
        data=WatchlistRecord(**doc)
    )

@router.post("/check", response_model=ApiResponse[WatchlistMatchResult], summary="Check if a document or person is flagged on watchlists")
async def check_watchlist_match(query: WatchlistCheckQuery):
    watchlist_col = get_collection("watchlists_blacklists")
    
    filters = []
    if query.document_number:
        filters.append({"document_number": query.document_number.upper().strip()})
    if query.full_name:
        filters.append({"full_name": {"$regex": f"^{query.full_name.strip()}$", "$options": "i"}})
        
    if not filters:
        return ApiResponse(
            success=True,
            message="No criteria provided.",
            data=WatchlistMatchResult(is_matched=False, match_count=0)
        )
        
    cursor = watchlist_col.find({"$or": filters})
    matches = await cursor.to_list(length=10)
    
    records = [WatchlistRecord(**m) for m in matches]
    is_matched = len(records) > 0
    highest_flag = records[0].flag_level if is_matched else None
    
    return ApiResponse(
        success=True,
        message="Watchlist search completed.",
        data=WatchlistMatchResult(
            is_matched=is_matched,
            match_count=len(records),
            matched_records=records,
            highest_flag_level=highest_flag
        )
    )

@router.delete("/{record_id}", response_model=ApiResponse[bool], summary="Delete an entry from watchlist")
async def delete_watchlist_entry(record_id: str):
    watchlist_col = get_collection("watchlists_blacklists")
    result = await watchlist_col.delete_one({"_id": record_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist record not found.")
        
    return ApiResponse(
        success=True,
        message="Watchlist entry deleted successfully.",
        data=True
    )
