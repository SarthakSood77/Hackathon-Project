import io
import cv2
import numpy as np
from PIL import Image, ExifTags
from typing import Tuple, Optional, Dict, Any, List
import logging

logger = logging.getLogger("border_guard.image")

def pdf_bytes_to_image_bytes(pdf_bytes: bytes) -> bytes:
    """Renders the first page of a PDF document to JPEG image bytes using PyMuPDF (fitz)."""
    try:
        import fitz
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if len(doc) == 0:
            raise ValueError("Uploaded PDF has no pages.")
        page = doc[0]
        # Render page at 2x resolution (144 dpi) for crisp OCR and forensic processing
        pix = page.get_pixmap(dpi=150)
        img_bytes = pix.tobytes("jpeg")
        doc.close()
        return img_bytes
    except Exception as e:
        logger.error(f"PDF rendering error: {e}")
        raise ValueError(f"Unable to process PDF document: {e}")

def ensure_image_bytes(file_bytes: bytes, filename: str = "", content_type: str = "") -> bytes:
    """Validates and converts input file bytes (JPEG, PNG, WEBP, PDF) into standard image bytes."""
    if not file_bytes or len(file_bytes) == 0:
        raise ValueError("File is empty.")
    
    # Check if PDF
    is_pdf = (
        content_type == "application/pdf"
        or filename.lower().endswith(".pdf")
        or file_bytes.startswith(b"%PDF")
    )
    if is_pdf:
        return pdf_bytes_to_image_bytes(file_bytes)
        
    # Check if valid image
    try:
        pil_img = Image.open(io.BytesIO(file_bytes))
        pil_img.verify()
        return file_bytes
    except Exception as e:
        raise ValueError("Unable to process document. Please upload a clear image (JPG, PNG) or PDF.")

def bytes_to_cv2(image_bytes: bytes) -> np.ndarray:
    """Converts raw image bytes to OpenCV BGR numpy array."""
    valid_bytes = ensure_image_bytes(image_bytes) if image_bytes.startswith(b"%PDF") else image_bytes
    nparr = np.frombuffer(valid_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image bytes into valid OpenCV image.")
    return img

def cv2_to_bytes(cv_img: np.ndarray, format: str = ".jpg") -> bytes:
    """Converts OpenCV numpy array to bytes."""
    success, buffer = cv2.imencode(format, cv_img)
    if not success:
        raise ValueError("Could not encode OpenCV image to bytes.")
    return buffer.tobytes()

def bytes_to_pil(image_bytes: bytes) -> Image.Image:
    """Converts raw image bytes to PIL Image in RGB format."""
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    return img

def extract_exif_metadata(image_bytes: bytes) -> Dict[str, Any]:
    """Extracts and analyzes EXIF metadata from image bytes."""
    meta = {
        "has_exif": False,
        "software": None,
        "is_suspicious_software": False,
        "creation_date": None,
        "modification_date": None,
        "camera_model": None,
        "all_tags": {}
    }
    
    suspicious_software_keywords = [
        "photoshop", "gimp", "canva", "photopea", "paint.net",
        "coreldraw", "illustrator", "affinity", "pixelmator", "lightroom"
    ]
    
    try:
        pil_img = Image.open(io.BytesIO(image_bytes))
        exif = pil_img.getexif()
        if exif:
            meta["has_exif"] = True
            for tag_id, value in exif.items():
                tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                meta["all_tags"][tag_name] = str(value)
                
                if tag_name.lower() == "software":
                    meta["software"] = str(value)
                    if any(sw in str(value).lower() for sw in suspicious_software_keywords):
                        meta["is_suspicious_software"] = True
                
                elif tag_name.lower() in ("datetimeoriginal", "datetime"):
                    if not meta["creation_date"]:
                        meta["creation_date"] = str(value)
                    else:
                        meta["modification_date"] = str(value)
                        
                elif tag_name.lower() == "model":
                    meta["camera_model"] = str(value)
                    
        # Check raw info dictionary as well (e.g., for PNG or Photoshop headers)
        if "Software" in pil_img.info:
            sw = str(pil_img.info["Software"])
            meta["software"] = sw
            if any(s in sw.lower() for s in suspicious_software_keywords):
                meta["is_suspicious_software"] = True
                
        if "photoshop" in str(pil_img.info).lower():
            meta["is_suspicious_software"] = True
            if not meta["software"]:
                meta["software"] = "Adobe Photoshop Signature in Header"
                
    except Exception as e:
        logger.debug(f"EXIF parsing info: {e}")
        
    return meta

def detect_and_crop_face(cv_img: np.ndarray) -> Tuple[bool, Optional[np.ndarray], Optional[Dict[str, int]]]:
    """
    Detects the primary face in the document/selfie using OpenCV or heuristic bounding box fallback.
    Returns (face_found, cropped_face_img, bounding_box_dict).
    """
    try:
        h, w = cv_img.shape[:2]
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        
        # 1. Check if CascadeClassifier is available
        face_classifier_cls = getattr(cv2, 'CascadeClassifier', None)
        if face_classifier_cls and hasattr(cv2, 'data') and hasattr(cv2.data, 'haarcascades'):
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            if os.path.exists(cascade_path):
                face_cascade = face_classifier_cls(cascade_path)
                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(50, 50))
                if len(faces) > 0:
                    faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
                    (x, y, fw, fh) = faces[0]
                    pad_x, pad_y = int(0.1 * fw), int(0.1 * fh)
                    x1, y1 = max(0, x - pad_x), max(0, y - pad_y)
                    x2, y2 = min(w, x + fw + pad_x), min(h, y + fh + pad_y)
                    return True, cv_img[y1:y2, x1:x2], {"x": int(x), "y": int(y), "width": int(fw), "height": int(fh), "w": int(fw), "h": int(fh)}
        
        # 2. Heuristic Portrait Extraction (Standard ICAO passport photo is on left 10-40% width, 15-60% height; selfie is centered)
        # If aspect ratio is landscape (e.g. passport), crop left zone; if roughly square, crop center zone
        if w > h * 1.2:
            # Landscape document (Passport/ID): photo is typically left side
            x1, y1 = int(w * 0.04), int(h * 0.15)
            x2, y2 = int(w * 0.38), int(h * 0.68)
        else:
            # Portrait/Square (Selfie/Face photo): center crop
            x1, y1 = int(w * 0.18), int(h * 0.12)
            x2, y2 = int(w * 0.82), int(h * 0.78)
            
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)
        face_crop = cv_img[y1:y2, x1:x2]
        
        if face_crop.size > 0:
            return True, face_crop, {"x": int(x1), "y": int(y1), "width": int(x2 - x1), "height": int(y2 - y1), "w": int(x2 - x1), "h": int(y2 - y1)}
            
        return False, None, None
    except Exception as e:
        logger.warning(f"Face detection notice: {e}")
        # Safe fallback crop
        h, w = cv_img.shape[:2]
        crop = cv_img[int(h*0.1):int(h*0.8), int(w*0.1):int(w*0.8)]
        return True, crop, {"x": int(w*0.1), "y": int(h*0.1), "width": int(w*0.7), "height": int(h*0.7), "w": int(w*0.7), "h": int(h*0.7)}


def calculate_noise_variance(cv_img: np.ndarray) -> float:
    """Calculates the Laplacian variance to measure sharpness and high-frequency noise."""
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())

def enhance_mrz_zone(cv_img: np.ndarray) -> np.ndarray:
    """Preprocesses bottom 30% of document for optimal OCR extraction of MRZ lines."""
    h, w = cv_img.shape[:2]
    mrz_roi = cv_img[int(h * 0.65):, :]
    gray = cv2.cvtColor(mrz_roi, cv2.COLOR_BGR2GRAY)
    
    # Adaptive thresholding and contrast stretch
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)
    
    return enhanced
