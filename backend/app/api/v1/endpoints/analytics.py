from fastapi import APIRouter
from datetime import datetime, timezone
import logging
from app.schemas.common import ApiResponse
from app.schemas.analytics import DashboardAnalytics, RiskDistribution, AlertTypeBreakdown
from app.core.database import get_collection

router = APIRouter(prefix="/analytics", tags=["Dashboard & Border Intelligence Analytics"])
logger = logging.getLogger("border_guard.api.analytics")

@router.get("/dashboard", response_model=ApiResponse[DashboardAnalytics], summary="Border Checkpoint Live KPI & Threat Analytics Dashboard")
async def get_dashboard_analytics():
    """
    Returns live aggregated KPIs for border control operations:
    - Passenger throughput & clearance rates
    - Forgery & counterfeit detection metrics
    - Distribution of risk tiers (Low, Medium, High, Critical)
    - Breakdown of primary threat vectors (Photo alterations, MRZ failures, Watchlist hits)
    """
    screenings_col = get_collection("screenings")
    records = await screenings_col.find({}).to_list(length=1000)
    
    total = len(records)
    cleared = 0
    manual_review = 0
    rejected = 0
    
    total_time = 0.0
    
    risk_dist = RiskDistribution()
    alerts = AlertTypeBreakdown()
    doc_types = {}
    
    for r in records:
        status = r.get("status")
        if status == "CLEARED":
            cleared += 1
        elif status == "MANUAL_REVIEW":
            manual_review += 1
        elif status == "REJECTED_HIGH_RISK":
            rejected += 1
            
        risk_lvl = r.get("risk_level", "LOW")
        if risk_lvl == "LOW":
            risk_dist.low += 1
        elif risk_lvl == "MEDIUM":
            risk_dist.medium += 1
        elif risk_lvl == "HIGH":
            risk_dist.high += 1
        elif risk_lvl == "CRITICAL":
            risk_dist.critical += 1
            
        dtype = r.get("document_type", "PASSPORT")
        doc_types[dtype] = doc_types.get(dtype, 0) + 1
        
        total_time += r.get("processing_time_ms", 250.0)
        
        # Analyze risk factors / alerts
        for rf in r.get("risk_factors", []):
            rf_lower = rf.lower()
            if "photo" in rf_lower or "splice" in rf_lower or "ela" in rf_lower:
                alerts.photo_alteration_alerts += 1
            if "checksum" in rf_lower or "mrz" in rf_lower:
                alerts.mrz_checksum_failures += 1
            if "software" in rf_lower or "photoshop" in rf_lower:
                alerts.photoshop_metadata_detected += 1
            if "expired" in rf_lower:
                alerts.expired_documents += 1
            if "watchlist" in rf_lower:
                alerts.watchlist_matches += 1
            if "face" in rf_lower or "mismatch" in rf_lower:
                alerts.face_mismatch_alerts += 1

    clearance_rate = round((cleared / total * 100.0), 1) if total > 0 else 100.0
    forgery_rate = round(((manual_review + rejected) / total * 100.0), 1) if total > 0 else 0.0
    avg_time = round((total_time / total), 1) if total > 0 else 220.0
    
    dashboard = DashboardAnalytics(
        total_screenings=total,
        cleared_count=cleared,
        manual_review_count=manual_review,
        rejected_count=rejected,
        clearance_rate_pct=clearance_rate,
        forgery_detection_rate_pct=forgery_rate,
        avg_processing_time_ms=avg_time,
        risk_distribution=risk_dist,
        top_alerts=alerts,
        screenings_by_doc_type=doc_types,
        last_updated=datetime.now(timezone.utc)
    )
    
    return ApiResponse(
        success=True,
        message="Live dashboard analytics generated.",
        data=dashboard
    )
