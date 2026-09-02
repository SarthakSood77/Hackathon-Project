"""
BorderGuard AI: Interactive Demo & End-to-End Simulation Script
---------------------------------------------------------------
Runs an automated multi-scenario border checkpoint inspection simulation:
1. Authentic Traveler (Anna Eriksson) -> CLEARED (Low Risk)
2. Spliced Photo & Tampered MRZ -> HIGH RISK (Tampering Alert)
3. Expired Visa Document -> REJECTED (Expired Stay)
4. Interpol Blacklist Stolen Passport -> CRITICAL ALERT (Watchlist Match)
"""

import sys
import io
import time

# Ensure UTF-8 stdout on Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import httpx
from app.main import app

def generate_passport_image(
    surname: str,
    given_names: str,
    doc_number: str,
    nationality: str,
    dob_yymmdd: str,
    exp_yymmdd: str,
    gender: str = "F",
    tamper_photo: bool = False,
    corrupt_mrz: bool = False
) -> bytes:
    """Creates a synthetic passport test image."""
    img = Image.new("RGB", (650, 420), color=(245, 246, 248))
    draw = ImageDraw.Draw(img)
    
    # Outer security border
    draw.rectangle([15, 15, 635, 405], outline=(100, 110, 130), width=2)
    draw.rectangle([20, 20, 630, 60], fill=(225, 232, 245))
    draw.text((35, 30), "PASSPORT / PASSEPORT  -  INTERNATIONAL CIVIL AVIATION", fill=(30, 45, 80))
    
    # Document Fields
    draw.text((35, 80), f"Type: P", fill=(50, 50, 50))
    draw.text((150, 80), f"Code: {nationality}", fill=(50, 50, 50))
    draw.text((300, 80), f"Passport No: {doc_number}", fill=(10, 10, 10))
    
    draw.text((35, 115), f"Surname: {surname}", fill=(10, 10, 10))
    draw.text((35, 145), f"Given Names: {given_names}", fill=(10, 10, 10))
    draw.text((35, 175), f"Nationality: {nationality}", fill=(10, 10, 10))
    draw.text((35, 205), f"Date of Birth: 19{dob_yymmdd[:2]}-{dob_yymmdd[2:4]}-{dob_yymmdd[4:]}", fill=(10, 10, 10))
    draw.text((35, 235), f"Date of Expiry: 20{exp_yymmdd[:2]}-{exp_yymmdd[2:4]}-{exp_yymmdd[4:]}", fill=(10, 10, 10))
    
    # Photo box
    draw.rectangle([460, 80, 610, 250], fill=(210, 220, 235), outline=(60, 70, 90), width=2)
    # Simulated portrait with facial features (eyes, nose, mouth) for Haar cascade detection
    draw.ellipse([485, 100, 585, 200], fill=(225, 205, 185), outline=(50, 60, 80), width=2)
    # Hair
    draw.arc([485, 95, 585, 160], 180, 360, fill=(40, 30, 20), width=6)
    # Eyes
    draw.ellipse([510, 135, 525, 148], fill=(50, 40, 30))
    draw.ellipse([545, 135, 560, 148], fill=(50, 40, 30))
    # Nose
    draw.line([(535, 145), (535, 165)], fill=(120, 90, 70), width=2)
    # Mouth
    draw.arc([515, 165, 555, 185], 0, 180, fill=(150, 60, 60), width=2)
    draw.text((505, 215), "PORTRAIT", fill=(100, 110, 130))
    
    if tamper_photo:
        # Splice a localized high-contrast patch to trigger ELA & noise variance forensics
        patch = Image.new("RGB", (70, 70), color=(255, 60, 60))
        img.paste(patch, (495, 110))
        
    # Calculate MRZ
    from app.services.mrz_parser import calculate_check_digit
    
    doc_num_field = doc_number.ljust(9, '<')[:9]
    cd_doc = calculate_check_digit(doc_num_field)
    cd_dob = calculate_check_digit(dob_yymmdd)
    cd_exp = calculate_check_digit(exp_yymmdd)
    personal_num_field = "ZE184226B<<<<<"
    cd_personal = "0"
    
    if corrupt_mrz:
        # Intentionally alter check digit to simulate amateur text editing
        cd_dob = "9" if cd_dob != "9" else "1"
        
    comp_data = doc_num_field + cd_doc + dob_yymmdd + cd_dob + exp_yymmdd + cd_exp + personal_num_field + cd_personal
    cd_comp = calculate_check_digit(comp_data)
    
    raw_name = f"{surname}<<{given_names.replace(' ', '<')}"
    line1 = f"P<{nationality}{raw_name}".ljust(44, '<')[:44]
    line2 = f"{doc_num_field}{cd_doc}{nationality}{dob_yymmdd}{cd_dob}{gender}{exp_yymmdd}{cd_exp}{personal_num_field}{cd_personal}{cd_comp}"
    
    # MRZ Zone box
    draw.rectangle([25, 290, 625, 385], fill=(235, 235, 235), outline=(150, 150, 150))
    draw.text((35, 305), line1, fill=(0, 0, 0))
    draw.text((35, 340), line2, fill=(0, 0, 0))
    
    buf = io.BytesIO()
    # Embed MRZ text in comment
    img.save(buf, format="JPEG", quality=92, comment=f"{line1}\n{line2}")
    return buf.getvalue()

def generate_live_selfie(match: bool = True, passport_bytes: bytes = None) -> bytes:
    """Creates a synthetic live camera snapshot of a passenger at e-Gate."""
    if match and passport_bytes:
        # Crop the face directly from passport image to simulate a real traveler match
        pil_pass = Image.open(io.BytesIO(passport_bytes))
        face_crop = pil_pass.crop((480, 95, 590, 205))
        face_canvas = Image.new("RGB", (300, 300), color=(220, 225, 230))
        face_canvas.paste(face_crop.resize((150, 150)), (75, 60))
        d = ImageDraw.Draw(face_canvas)
        d.text((85, 240), "LIVE CAMERA MATCH", fill=(40, 50, 60))
        buf = io.BytesIO()
        face_canvas.save(buf, format="JPEG", quality=90)
        return buf.getvalue()

    img = Image.new("RGB", (300, 300), color=(220, 225, 230))
    draw = ImageDraw.Draw(img)
    
    # Draw different face for mismatch
    face_color = (160, 120, 90)
    draw.ellipse([60, 40, 240, 220], fill=face_color, outline=(40, 50, 60), width=2)
    # Hair
    draw.arc([60, 35, 240, 130], 180, 360, fill=(10, 10, 10), width=10)
    # Eyes
    draw.ellipse([95, 110, 120, 130], fill=(20, 20, 20))
    draw.ellipse([180, 110, 205, 130], fill=(20, 20, 20))
    # Mustache / Beard
    draw.arc([115, 160, 185, 190], 0, 180, fill=(30, 20, 10), width=6)
    draw.text((80, 245), "LIVE CAMERA (IMPOSTOR)", fill=(50, 60, 70))
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()

async def run_simulation():
    from httpx import AsyncClient, ASGITransport
    transport = ASGITransport(app=app)
    
    print("=" * 80)
    print(" 🛡️ BORDERGUARD AI - AIRPORT & CHECKPOINT SCREENING SIMULATION")
    print("=" * 80)
    
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Pre-seed watchlist
        await client.post("/api/v1/watchlist", json={
            "document_number": "P99887766",
            "full_name": "CARLOS MENDEZ",
            "nationality": "MEX",
            "reason": "INTERPOL_RED_NOTICE",
            "flag_level": "CRITICAL"
        })
        
        # Generate Scenario Images
        img_anna = generate_passport_image("ERIKSSON", "ANNA MARIA", "N12345678", "UTO", "880512", "320512")
        img_smith = generate_passport_image("SMITH", "JOHN", "P44556677", "UTO", "850201", "300201", tamper_photo=True, corrupt_mrz=True)
        img_dupont = generate_passport_image("DUPONT", "JEAN", "P55667788", "FRA", "750810", "220810")
        img_mendez = generate_passport_image("MENDEZ", "CARLOS", "P99887766", "MEX", "820414", "310414")

        scenarios = [
            {
                "title": "Scenario 1: Authentic Traveler (Anna Eriksson)",
                "img": img_anna,
                "selfie": generate_live_selfie(match=True, passport_bytes=img_anna),
                "expected": "CLEARED"
            },
            {
                "title": "Scenario 2: Spliced Photo & Modified Birthdate (Tampered)",
                "img": img_smith,
                "selfie": generate_live_selfie(match=False),
                "expected": "REJECTED_HIGH_RISK / MANUAL_REVIEW"
            },
            {
                "title": "Scenario 3: Expired Travel Document (Expired in 2022)",
                "img": img_dupont,
                "selfie": generate_live_selfie(match=True, passport_bytes=img_dupont),
                "expected": "REJECTED_HIGH_RISK"
            },
            {
                "title": "Scenario 4: Interpol Red Notice (Stolen ID / Wanted Person)",
                "img": img_mendez,
                "selfie": generate_live_selfie(match=True, passport_bytes=img_mendez),
                "expected": "REJECTED_HIGH_RISK (CRITICAL)"
            }
        ]
        
        for idx, sc in enumerate(scenarios, 1):
            print(f"\n[TEST #{idx}] {sc['title']}")
            print("-" * 75)
            
            files = {
                "document_image": ("passport.jpg", sc["img"], "image/jpeg"),
                "live_face_image": ("selfie.jpg", sc["selfie"], "image/jpeg")
            }
            data = {
                "checkpoint_id": "GATE-04-INTERNATIONAL",
                "officer_id": "OFFICER-DEMO"
            }
            
            res = await client.post("/api/v1/screen/full", files=files, data=data)
            dec = res.json()["data"]
            
            status_icon = "🟢" if dec["status"] == "CLEARED" else ("🟡" if dec["status"] == "MANUAL_REVIEW" else "🔴")
            
            print(f"Decision Status   : {status_icon} {dec['status']} (Risk Level: {dec['risk_level']})")
            print(f"Risk Score        : {dec['risk_score']} / 100")
            print(f"Processing Time   : {dec['processing_time_ms']:.1f} ms")
            print(f"Document Number   : {dec.get('document_number') or 'N/A'}")
            print(f"Holder Name       : {dec.get('holder_name') or 'N/A'}")
            print(f"MRZ Checksum Valid: {dec['validation_result']['mrz_checksum_passed']}")
            print(f"Tamper ELA Score  : {dec['tampering_result']['ela_analysis']['ela_anomaly_score']}/100 (Hotspots: {dec['tampering_result']['ela_analysis']['hotspot_count']})")
            print(f"Face Similarity   : {dec['face_result']['similarity_score'] * 100:.1f}% ({dec['face_result']['match_status']})")
            print(f"Action Order      : {dec['recommended_action']}")
            if dec["risk_factors"]:
                print("Key Risk Factors  :")
                for rf in dec["risk_factors"]:
                    print(f"  • {rf}")
            if dec.get("ela_heatmap_url"):
                print(f"Forensic ELA Path : {dec['ela_heatmap_url']}")
                
        # Print Dashboard Analytics
        print("\n" + "=" * 80)
        print(" 📊 LIVE BORDER INTELLIGENCE DASHBOARD SNAPSHOT")
        print("=" * 80)
        dash_res = await client.get("/api/v1/analytics/dashboard")
        dash = dash_res.json()["data"]
        print(f"Total Screenings Processed : {dash['total_screenings']}")
        print(f"Cleared Passengers         : {dash['cleared_count']} ({dash['clearance_rate_pct']}%)")
        print(f"Flagged for Review / Denied: {dash['manual_review_count'] + dash['rejected_count']} ({dash['forgery_detection_rate_pct']}%)")
        print(f"Average Screening Latency  : {dash['avg_processing_time_ms']} ms (Sub-second)")
        print(f"Risk Distribution          : Low: {dash['risk_distribution']['low']}, Medium: {dash['risk_distribution']['medium']}, High: {dash['risk_distribution']['high']}, Critical: {dash['risk_distribution']['critical']}")
        print("=" * 80)

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_simulation())
