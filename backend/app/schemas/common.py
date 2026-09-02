from enum import Enum
from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

T = TypeVar("T")

class DocumentType(str, Enum):
    PASSPORT = "PASSPORT"
    VISA = "VISA"
    NATIONAL_ID = "NATIONAL_ID"
    DRIVING_LICENSE = "DRIVING_LICENSE"
    PERMIT = "PERMIT"
    UNKNOWN = "UNKNOWN"

class ScreeningStatus(str, Enum):
    CLEARED = "CLEARED"                          # Green - 0-25 risk
    MANUAL_REVIEW = "MANUAL_REVIEW"              # Amber - 26-65 risk
    REJECTED_HIGH_RISK = "REJECTED_HIGH_RISK"    # Red - 66-100 risk

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class TamperSeverity(str, Enum):
    NONE = "NONE"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH = "HIGH"

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Success"
    data: Optional[T] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
