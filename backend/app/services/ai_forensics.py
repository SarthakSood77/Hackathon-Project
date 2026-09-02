import logging
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger("border_guard.ai_forensics")

class AIForensicsService:
    @staticmethod
    async def analyze_document_forensics_gemini(image_bytes: bytes) -> Optional[Dict[str, Any]]:
        """
        Deep Multimodal Forensic inspection of physical security features:
        - Hologram integrity & rainbow optical variable ink (OVI)
        - Guilloche patterns & microprint sharpness
        - Ghost portrait alignment & watermark presence
        - Visa stamp bleed-through and font alignment
        """
        if not settings.GEMINI_API_KEY:
            return None
            
        try:
            from google import genai
            from google.genai import types
            import json
            
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            prompt = """
            You are a senior forensic document examiner at an international border checkpoint.
            Inspect the attached identity/travel document image for physical and digital counterfeiting signs.
            
            Evaluate:
            1. Microprint / Guilloche line sharpness (is there digital blurring or inkjet pixelation?)
            2. Holographic / OVI feature consistency
            3. Photo boundary and laminate integrity
            4. Font consistency (spacing, typeface, baseline alignment)
            5. Visa stamp consistency and ink bleed
            
            Respond strictly in valid JSON:
            {
                "forensic_risk_score": float 0-100,
                "microprint_authenticity": "AUTHENTIC" | "SUSPICIOUS" | "POOR_RESOLUTION",
                "photo_laminate_status": "INTACT" | "SIGNS_OF_TAMPERING",
                "font_consistency": "CONSISTENT" | "ANOMALOUS_CHARACTERS",
                "forensic_observations": ["bullet 1", "bullet 2"],
                "recommendation": "string"
            }
            """
            
            image_part = types.Part.from_bytes(
                data=image_bytes,
                mime_type="image/jpeg"
            )
            
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[prompt, image_part],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            if response.text:
                return json.loads(response.text)
        except Exception as e:
            logger.warning(f"AI Forensics Gemini analysis notice: {e}")
            
        return None
