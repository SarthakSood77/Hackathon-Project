from pathlib import Path
import json
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "IDShield AI - Fake Identity & Document Screening System"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # MongoDB Settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "border_guard_db"
    
    # Security & CORS — stored as str to avoid pydantic-settings json.loads crash
    SECRET_KEY: str = "change-this-to-a-secure-random-key-in-production"
    ALLOWED_ORIGINS_RAW: str = "*"

    # Optional Gemini AI API Key for Deep Forensics & Visual Zero-Shot OCR
    GEMINI_API_KEY: str = ""
    
    # Upload Limits
    MAX_FILE_SIZE_MB: int = 15
    
    # Directories
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    STATIC_DIR: Path = BASE_DIR / "static"
    ELA_REPORTS_DIR: Path = BASE_DIR / "static" / "ela_reports"
    SAMPLE_DATA_DIR: Path = BASE_DIR / "data"
    FRONTEND_DIST_DIR: Path = BASE_DIR.parent / "dist"
    
    # Risk Score Calibration (0 to 100)
    LOW_RISK_THRESHOLD: int = 25
    HIGH_RISK_THRESHOLD: int = 65
    
    # Weights for Risk Engine
    WEIGHT_MRZ_CHECKSUM: float = 0.25
    WEIGHT_TAMPERING_ELA: float = 0.35
    WEIGHT_FACE_MATCH: float = 0.25
    WEIGHT_EXPIRY_DATE: float = 0.15

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        raw = self.ALLOWED_ORIGINS_RAW.strip()
        if not raw or raw == "*":
            return ["*"]
        if raw.startswith("[") and raw.endswith("]"):
            try:
                return json.loads(raw)
            except Exception:
                pass
        if "," in raw:
            return [i.strip() for i in raw.split(",") if i.strip()]
        return [raw]

settings = Settings()

# Ensure directories exist
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.STATIC_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.ELA_REPORTS_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.SAMPLE_DATA_DIR).mkdir(parents=True, exist_ok=True)
