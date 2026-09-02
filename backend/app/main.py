import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import logging
from app.config import settings
from app.core.database import DatabaseManager, get_collection
from app.core.exceptions import BorderGuardException, border_guard_exception_handler
from app.api.v1.router import api_v1_router

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("border_guard.main")

async def seed_initial_watchlist():
    """Seeds sample watchlist data if empty so the system is immediately testable."""
    try:
        watchlist_col = get_collection("watchlists_blacklists")
        count = await watchlist_col.count_documents({})
        if count == 0:
            sample_file = settings.SAMPLE_DATA_DIR / "sample_watchlist.json"
            if sample_file.exists():
                with open(sample_file, "r", encoding="utf-8") as f:
                    entries = json.load(f)
                    for item in entries:
                        await watchlist_col.insert_one(item)
                logger.info(f" Seeded {len(entries)} watchlist items from sample_watchlist.json")
    except Exception as e:
        logger.warning(f"Could not seed watchlist: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing BorderGuard AI Backend Engine...")
    await DatabaseManager.connect()
    await seed_initial_watchlist()
    logger.info("🚀 BorderGuard AI Platform is ready for border checkpoint operations!")
    yield
    # Shutdown
    logger.info("Shutting down BorderGuard AI...")
    await DatabaseManager.disconnect()

app = FastAPI(
    title=settings.APP_NAME,
    description="""
# 🛡️ BorderGuard AI: Fake Identity & Document Screening System

High-throughput, AI-powered document verification and digital forensics backend designed for international border security checkpoints and e-Gates.

---

### 🔍 Key Capabilities & Modules
1. **Module 1: OCR & MRZ Extraction**
   - Extracts structured biographical fields from passports, visas, national IDs, and driving licenses.
   - Parses standard **ICAO Doc 9303 MRZ** (TD1, TD2, TD3, Visas).
2. **Module 2: Document Validation Engine**
   - Validates **Modulo-10 checksums** (7-3-1 weighting) across Document Number, DOB, and Expiration.
   - Cross-checks visual zone text against MRZ zone.
   - Real-time **Interpol & Stolen Document Watchlist** matching.
3. **Module 3: Tampering & Digital Forensics (Core AI Innovation)**
   - **Error Level Analysis (ELA)**: Exposes photo replacements and edited text numbers through recompression gradient differences.
   - **Metadata Forensics**: Detects Photoshop, GIMP, Canva, and image manipulation software signatures.
   - **Photo Boundary Discontinuity**: Flags noise variance anomalies across passport photo borders.
4. **Module 4: Facial Biometric Verification**
   - 1:1 Biometric matching between document portrait and live checkpoint camera selfie.
   - Anti-spoofing heuristic texture assessment.
5. **Risk Scoring & Decision Engine**
   - Computes normalized **0 - 100 Risk Score** and transparent risk breakdown.
   - Assigns standard border decisions: `CLEARED (GREEN)`, `MANUAL_REVIEW (AMBER)`, `REJECTED_HIGH_RISK (RED)`.
6. **Live Intelligence Analytics**
   - Real-time KPI dashboard with passenger throughput, forgery rates, and threat vector distributions.
""",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for forensic ELA heatmap viewing
app.mount("/static", StaticFiles(directory=str(settings.STATIC_DIR)), name="static")

from fastapi.responses import JSONResponse, FileResponse

# Custom exception handlers
app.add_exception_handler(BorderGuardException, border_guard_exception_handler)

# Include API Router
app.include_router(api_v1_router)

@app.get("/health", tags=["System Information"])
async def health_check():
    return {
        "status": "HEALTHY",
        "database": {
            "type": "In-Memory" if DatabaseManager.is_in_memory else "MongoDB",
            "connected": True
        },
        "modules_ready": {
            "ocr_engine": True,
            "mrz_parser": True,
            "tamper_detection_ela": True,
            "face_verification": True,
            "risk_engine": True
        }
    }

@app.get("/api-info", tags=["System Information"])
async def system_info():
    return {
        "system": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "documentation": "/docs",
        "redoc": "/redoc",
        "database_mode": "In-Memory Fallback" if DatabaseManager.is_in_memory else "MongoDB Live"
    }

# Mount Frontend SPA if dist exists
if settings.FRONTEND_DIST_DIR.exists():
    assets_dir = settings.FRONTEND_DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="frontend_assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        file_path = settings.FRONTEND_DIST_DIR / full_path
        if full_path and file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        index_file = settings.FRONTEND_DIST_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return JSONResponse({"detail": "Frontend build not found"}, status_code=404)
else:
    @app.get("/", tags=["System Information"])
    async def root_info():
        return await system_info()
