from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("border_guard")

class BorderGuardException(Exception):
    """Base exception for BorderGuard AI system"""
    def __init__(self, message: str, code: str = "PROCESSING_ERROR", details: dict | None = None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)

class DocumentProcessingError(BorderGuardException):
    def __init__(self, message: str, details: dict | None = None):
        super().__init__(message, code="DOCUMENT_PROCESSING_ERROR", details=details)

class MRZParseError(BorderGuardException):
    def __init__(self, message: str, details: dict | None = None):
        super().__init__(message, code="MRZ_PARSE_ERROR", details=details)

class TamperAnalysisError(BorderGuardException):
    def __init__(self, message: str, details: dict | None = None):
        super().__init__(message, code="TAMPER_ANALYSIS_ERROR", details=details)

class FaceVerificationError(BorderGuardException):
    def __init__(self, message: str, details: dict | None = None):
        super().__init__(message, code="FACE_VERIFICATION_ERROR", details=details)

async def border_guard_exception_handler(request: Request, exc: BorderGuardException):
    logger.error(f"BorderGuard error [{exc.code}] on {request.url.path}: {exc.message}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error_code": exc.code,
            "message": exc.message,
            "details": exc.details
        }
    )
