from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.common import DocumentType

class MRZChecksumDetail(BaseModel):
    field_name: str
    extracted_value: str
    expected_check_digit: str
    actual_check_digit: str
    is_valid: bool

class MRZData(BaseModel):
    format: str = Field(description="TD1 (ID), TD2, TD3 (Passport), MRVA, MRVB")
    document_code: str
    issuing_country: str
    document_number: str
    check_digit_doc: str
    nationality: str
    date_of_birth: str  # YYMMDD
    check_digit_dob: str
    gender: str
    expiration_date: str  # YYMMDD
    check_digit_exp: str
    personal_number: Optional[str] = None
    check_digit_personal: Optional[str] = None
    composite_check_digit: Optional[str] = None
    
    # Calculated Validity
    is_checksum_valid: bool = True
    checksum_breakdown: List[MRZChecksumDetail] = []
    raw_lines: List[str] = []

class PassportFields(BaseModel):
    full_name: Optional[str] = None
    surname: Optional[str] = None
    given_names: Optional[str] = None
    passport_number: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None       # YYYY-MM-DD
    date_of_expiry: Optional[str] = None      # YYYY-MM-DD
    gender: Optional[str] = None              # M, F, X
    issuing_country: Optional[str] = None
    personal_number: Optional[str] = None

class VisaFields(BaseModel):
    visa_number: Optional[str] = None
    visa_type: Optional[str] = None           # Tourist, Business, Student, Transit
    holder_name: Optional[str] = None
    passport_number: Optional[str] = None
    issuing_country: Optional[str] = None
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    entries_allowed: Optional[str] = None     # Single (1), Double (2), Multiple (M)
    stay_duration_days: Optional[int] = None

class NationalIDFields(BaseModel):
    id_number: Optional[str] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    date_of_expiry: Optional[str] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    address: Optional[str] = None

class DrivingLicenseFields(BaseModel):
    license_number: Optional[str] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    expiry_date: Optional[str] = None
    vehicle_classes: Optional[str] = None

class OCRExtractionResult(BaseModel):
    document_type: DocumentType = DocumentType.UNKNOWN
    mrz_detected: bool = False
    mrz_data: Optional[MRZData] = None
    passport_fields: Optional[PassportFields] = None
    visa_fields: Optional[VisaFields] = None
    national_id_fields: Optional[NationalIDFields] = None
    driving_license_fields: Optional[DrivingLicenseFields] = None
    raw_text: Optional[str] = None
    confidence_score: float = Field(default=0.95, ge=0.0, le=1.0)
    extraction_engine: str = "LOCAL_ICAO_MRZ_ENGINE"
    warnings: List[str] = []
