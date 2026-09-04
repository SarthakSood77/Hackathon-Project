import io
import os
import uuid
import numpy as np
import cv2
from PIL import Image, ImageChops, ImageEnhance
from typing import Tuple, Dict, Any, Optional
from pathlib import Path
from app.config import settings

def perform_error_level_analysis(
    image_bytes: bytes,
    quality: int = 90,
    scale_multiplier: float = 18.0,
    save_heatmap: bool = True,
    filename_prefix: str = "ela"
) -> Dict[str, Any]:
    """
    Executes Error Level Analysis (ELA) on an image to detect digital tampering,
    such as photo replacement, text modification, or cloned regions.
    
    Returns:
        dict with:
            - anomaly_score (0.0 to 100.0)
            - mean_error
            - max_error
            - localized_hotspots_detected (bool)
            - hotspot_count (int)
            - heatmap_relative_path (str)
            - heatmap_absolute_path (str)
    """
    # 1. Open original image
    orig_pil = Image.open(io.BytesIO(image_bytes))
    if orig_pil.mode != "RGB":
        orig_pil = orig_pil.convert("RGB")
        
    # 2. Resave to memory buffer at target compression quality
    buffer = io.BytesIO()
    orig_pil.save(buffer, "JPEG", quality=quality)
    buffer.seek(0)
    recompressed_pil = Image.open(buffer)
    
    # 3. Calculate absolute difference
    diff = ImageChops.difference(orig_pil, recompressed_pil)
    
    # 4. Enhance scale
    extrema = diff.getextrema()
    max_diff = max([ex[1] for ex in extrema]) if extrema else 1
    if max_diff == 0:
        max_diff = 1
        
    # Scale differences so human eyes & algorithms can clearly detect variations
    scale = min(scale_multiplier, 255.0 / max_diff) if max_diff < (255.0 / scale_multiplier) else (255.0 / max_diff)
    diff_enhanced = ImageEnhance.Brightness(diff).enhance(scale)
    
    # 5. Convert to numpy for statistical & spatial hotspot analysis
    diff_np = np.array(diff_enhanced)
    diff_gray = cv2.cvtColor(diff_np, cv2.COLOR_RGB2GRAY)
    
    mean_val = float(np.mean(diff_gray))
    std_val = float(np.std(diff_gray))
    max_val = float(np.max(diff_gray))
    
    # Spliced regions exhibit compression error significantly higher than background average
    # Threshold for localized hotspots: mean + 2.5 * std (and above an absolute error threshold)
    hotspot_threshold = max(mean_val + 3.0 * std_val, 55.0)
    _, hotspot_mask = cv2.threshold(diff_gray, hotspot_threshold, 255, cv2.THRESH_BINARY)
    
    # Find contours of anomalous clusters
    contours, _ = cv2.findContours(hotspot_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    significant_hotspots = [c for c in contours if cv2.contourArea(c) > 300]
    hotspot_count = len(significant_hotspots)
    
    # 6. Compute Normalized Anomaly Score (0 - 100)
    # Higher std_dev + high hotspot count = high probability of tamper/splice
    raw_score = (std_val * 1.8) + (hotspot_count * 12.0) + (mean_val * 0.4)
    anomaly_score = min(100.0, max(0.0, float(raw_score)))
    
    heatmap_rel_path = None
    heatmap_abs_path = None
    
    if save_heatmap:
        # Create Jet color map for clear visual forensic presentation
        color_heatmap = cv2.applyColorMap(diff_gray, cv2.COLORMAP_JET)
        
        # Highlight significant anomaly contours with bright white boundary
        cv2.drawContours(color_heatmap, significant_hotspots, -1, (255, 255, 255), 2)
        
        file_id = f"{filename_prefix}_{uuid.uuid4().hex[:10]}.jpg"
        save_path = settings.ELA_REPORTS_DIR / file_id
        cv2.imwrite(str(save_path), color_heatmap)
        
        heatmap_rel_path = f"/static/ela_reports/{file_id}"
        heatmap_abs_path = str(save_path)
        
    return {
        "anomaly_score": round(anomaly_score, 2),
        "mean_error": round(mean_val, 2),
        "max_error": round(max_val, 2),
        "localized_hotspots_detected": hotspot_count > 0,
        "hotspot_count": hotspot_count,
        "heatmap_relative_path": heatmap_rel_path,
        "heatmap_absolute_path": heatmap_abs_path
    }
