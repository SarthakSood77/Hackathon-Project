from typing import Dict, List, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class RiskDistribution(BaseModel):
    low: int = 0
    medium: int = 0
    high: int = 0
    critical: int = 0

class AlertTypeBreakdown(BaseModel):
    photo_alteration_alerts: int = 0
    mrz_checksum_failures: int = 0
    photoshop_metadata_detected: int = 0
    expired_documents: int = 0
    watchlist_matches: int = 0
    face_mismatch_alerts: int = 0

class DashboardAnalytics(BaseModel):
    total_screenings: int = 0
    cleared_count: int = 0
    manual_review_count: int = 0
    rejected_count: int = 0
    
    # Rates
    clearance_rate_pct: float = 0.0
    forgery_detection_rate_pct: float = 0.0
    avg_processing_time_ms: float = 0.0
    
    # Distributions
    risk_distribution: RiskDistribution
    top_alerts: AlertTypeBreakdown
    screenings_by_doc_type: Dict[str, int] = {}
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
