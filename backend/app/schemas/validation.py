from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class RuleCheckResult(BaseModel):
    rule_name: str
    category: str  # CHECKSUM, DATE, FORMAT, WATCHLIST, CROSS_CHECK
    passed: bool
    description: str
    severity: str = "HIGH"  # CRITICAL, HIGH, MEDIUM, LOW

class DocumentValidationResult(BaseModel):
    is_valid: bool = True
    is_expired: bool = False
    days_until_expiry: Optional[int] = None
    mrz_checksum_passed: bool = True
    dob_valid: bool = True
    cross_check_passed: bool = True
    watchlist_hit: bool = False
    watchlist_reason: Optional[str] = None
    
    # Rule Breakdown
    rules_evaluated: int = 0
    rules_passed_count: int = 0
    rules_failed_count: int = 0
    rule_results: List[RuleCheckResult] = []
    
    # Validation Quality Score (0 to 100)
    validation_score: float = Field(default=100.0, ge=0.0, le=100.0)
    summary_notes: List[str] = []
