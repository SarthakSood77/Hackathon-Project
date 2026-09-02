from fastapi import APIRouter
from app.api.v1.endpoints import (
    screening,
    ocr,
    validation,
    tampering,
    face,
    watchlist,
    analytics
)

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(screening.router)
api_v1_router.include_router(ocr.router)
api_v1_router.include_router(validation.router)
api_v1_router.include_router(tampering.router)
api_v1_router.include_router(face.router)
api_v1_router.include_router(watchlist.router)
api_v1_router.include_router(analytics.router)
