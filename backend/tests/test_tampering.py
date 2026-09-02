import io
import pytest
from PIL import Image, ImageDraw
import numpy as np
from app.utils.ela import perform_error_level_analysis
from app.services.tampering_service import TamperingService
from app.schemas.common import TamperSeverity

def create_synthetic_image(tampered: bool = False) -> bytes:
    """Creates a synthetic test document image."""
    img = Image.new("RGB", (400, 300), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    
    # Draw document borders and background texture
    draw.rectangle([10, 10, 390, 290], outline=(100, 100, 100), width=2)
    draw.text((20, 30), "PASSPORT / PASSEPORT", fill=(0, 0, 0))
    draw.text((20, 60), "SURNAME: DOE", fill=(0, 0, 0))
    draw.text((20, 90), "GIVEN NAMES: JOHN", fill=(0, 0, 0))
    draw.text((20, 120), "NATIONALITY: UTO", fill=(0, 0, 0))
    
    # Draw photo box
    draw.rectangle([260, 40, 370, 180], fill=(200, 210, 220), outline=(0, 0, 0))
    
    if tampered:
        # Splice a high-contrast anomalous patch into the photo box
        patch = Image.new("RGB", (60, 60), color=(255, 0, 0))
        img.paste(patch, (280, 60))
        
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    return buf.getvalue()

def test_ela_analysis_execution():
    img_bytes = create_synthetic_image(tampered=False)
    ela_res = perform_error_level_analysis(img_bytes, quality=90, save_heatmap=False)
    
    assert "anomaly_score" in ela_res
    assert "mean_error" in ela_res
    assert "hotspot_count" in ela_res
    assert isinstance(ela_res["anomaly_score"], float)

def test_tampering_service_clean_vs_altered():
    clean_bytes = create_synthetic_image(tampered=False)
    clean_res = TamperingService.analyze_document_tampering(clean_bytes, screening_id="test_clean")
    assert clean_res.tamper_risk_score <= 50.0
    
    tampered_bytes = create_synthetic_image(tampered=True)
    tampered_res = TamperingService.analyze_document_tampering(tampered_bytes, screening_id="test_tampered")
    assert tampered_res.ela_analysis.localized_hotspots_detected is True or tampered_res.tamper_risk_score > 0
