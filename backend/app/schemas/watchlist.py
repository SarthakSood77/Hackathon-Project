from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid

class WatchlistBase(BaseModel):
    document_number: Optional[str] = None
    full_name: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None
    reason: str = Field(description="STOLEN_DOCUMENT, TERRORIST_WATCHLIST, IMMIGRATION_BAN, INTERPOL_RED_NOTICE, FRAUD_HISTORY")
    flag_level: str = Field(default="CRITICAL", description="CRITICAL, HIGH, MEDIUM")
    issuing_authority: Optional[str] = "INTERPOL"
    notes: Optional[str] = None

class WatchlistCreate(WatchlistBase):
    pass

class WatchlistRecord(WatchlistBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "_id": "123e4567-e89b-12d3-a456-426614174000",
                "document_number": "P99887766",
                "full_name": "CARLOS MENDEZ",
                "nationality": "MEX",
                "reason": "INTERPOL_RED_NOTICE",
                "flag_level": "CRITICAL"
            }
        }
    )

class WatchlistCheckQuery(BaseModel):
    document_number: Optional[str] = None
    full_name: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None

class WatchlistMatchResult(BaseModel):
    is_matched: bool = False
    match_count: int = 0
    matched_records: List[WatchlistRecord] = []
    highest_flag_level: Optional[str] = None
