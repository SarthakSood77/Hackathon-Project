import pytest
import io
from PIL import Image, ImageDraw
from httpx import AsyncClient, ASGITransport
from app.main import app

def generate_test_passport_img() -> bytes:
    img = Image.new("RGB", (500, 350), color=(245, 245, 245))
    draw = ImageDraw.Draw(img)
    draw.rectangle([10, 10, 490, 340], outline=(120, 120, 120), width=2)
    draw.text((30, 30), "PASSPORT / PASSEPORT", fill=(0, 0, 0))
    draw.text((30, 60), "SURNAME: ERIKSSON", fill=(0, 0, 0))
    draw.text((30, 90), "GIVEN NAMES: ANNA MARIA", fill=(0, 0, 0))
    draw.text((30, 120), "PASSPORT NO: L898902C3", fill=(0, 0, 0))
    draw.text((30, 150), "NATIONALITY: UTO", fill=(0, 0, 0))
    # Add MRZ zone
    draw.text((30, 270), "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<", fill=(0, 0, 0))
    draw.text((30, 300), "L898902C36UTO7408122F1204159ZE184226B<<<<<10", fill=(0, 0, 0))
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    return buf.getvalue()

@pytest.mark.anyio
async def test_root_and_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/")
        assert res.status_code == 200
        
        info_res = await ac.get("/api-info")
        assert info_res.status_code == 200
        assert info_res.json()["status"] == "OPERATIONAL"
        
        health_res = await ac.get("/health")
        assert health_res.status_code == 200
        assert health_res.json()["status"] == "HEALTHY"

@pytest.mark.anyio
async def test_watchlist_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create watchlist entry
        new_entry = {
            "document_number": "P99112233",
            "full_name": "TEST SUSPECT",
            "nationality": "UTO",
            "reason": "TERRORIST_WATCHLIST",
            "flag_level": "CRITICAL"
        }
        res = await ac.post("/api/v1/watchlist", json=new_entry)
        assert res.status_code == 201
        data = res.json()["data"]
        assert data["document_number"] == "P99112233"
        record_id = data.get("id") or data.get("_id")
        assert record_id is not None
        
        # Check matching
        check_res = await ac.post("/api/v1/watchlist/check", json={"document_number": "P99112233"})
        assert check_res.status_code == 200
        assert check_res.json()["data"]["is_matched"] is True

@pytest.mark.anyio
async def test_full_screening_pipeline():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        img_bytes = generate_test_passport_img()
        
        files = {
            "document_image": ("passport.jpg", img_bytes, "image/jpeg")
        }
        data = {
            "checkpoint_id": "GATE-01-E-GATE",
            "officer_id": "OFFICER-742"
        }
        
        res = await ac.post("/api/v1/screen/full", files=files, data=data)
        assert res.status_code == 200
        body = res.json()
        assert body["success"] is True
        assert "data" in body
        decision = body["data"]
        assert "screening_id" in decision
        assert "risk_score" in decision
        assert "status" in decision
        assert "recommended_action" in decision
        assert len(decision["risk_components"]) > 0

@pytest.mark.anyio
async def test_analytics_dashboard():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/analytics/dashboard")
        assert res.status_code == 200
        data = res.json()["data"]
        assert "total_screenings" in data
        assert "clearance_rate_pct" in data
