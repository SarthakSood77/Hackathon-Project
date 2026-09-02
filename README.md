# SENTINEL AI — Border Guard AI System

## 📁 Project Structure

```
D:\Codes\Az\
├── backend/               ← FastAPI Python AI Backend
│   ├── app/
│   │   ├── api/v1/        ← REST endpoints (screen, ocr, face, tampering, watchlist, analytics)
│   │   ├── services/      ← AI modules (OCR, ELA, Face Biometrics, MRZ Parser, Risk Engine)
│   │   ├── core/          ← MongoDB + in-memory database
│   │   └── main.py        ← FastAPI app entrypoint
│   ├── tests/             ← 12 unit + integration tests (100% pass)
│   ├── requirements.txt
│   └── README.md
│
├── src/                   ← React 18 + Vite + Tailwind CSS Frontend
│   ├── components/screening/  ← 6-step screening wizard UI
│   ├── context/           ← ScreeningContext (state + live API wiring)
│   ├── utils/
│   │   ├── api.js         ← FastAPI REST client
│   │   └── scenarioMapper.js  ← Backend response → UI adapter
│   ├── views/             ← Dashboard, History, Analytics, Identity Search
│   └── data/              ← Demo scenario presets (Hackathon A/B/C)
│
├── dist/                  ← Pre-built frontend (ready to serve)
├── start.ps1              ← ONE-CLICK startup script
└── package.json
```

## 🚀 Quick Start (One Command)

Open PowerShell in `D:\Codes\Az` and run:

```powershell
.\start.ps1
```

This automatically:
1. Starts the **FastAPI backend** on `http://localhost:8000`
2. Serves the **React frontend** on `http://localhost:5173`
3. Opens your browser automatically

## 🔧 Manual Start

### Backend
```powershell
cd D:\Codes\Az\backend
uvicorn app.main:app --reload --port 8000
```

### Frontend
```powershell
cd D:\Codes\Az
python -m http.server 5173 --directory dist
```

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend (Sentinel AI UI) | http://localhost:5173 |
| Backend (FastAPI) | http://localhost:8000 |
| Interactive API Docs | http://localhost:8000/docs |

## 🤖 AI Modules

| Module | Technology |
|--------|-----------|
| OCR Extraction | Regex + Pattern Scanner + Gemini Vision fallback |
| Tampering Detection | Error Level Analysis (ELA) + EXIF + Laplacian Noise |
| Face Biometrics | HSV + Sobel Gradient Cosine Similarity |
| MRZ Validation | ICAO 9303 Modulo-10 Checksum |
| Risk Engine | Multi-factor weighted scoring (0–100) |
| Watchlist | MongoDB / In-memory blacklist queries |

## 🧪 Tests

```powershell
cd D:\Codes\Az\backend
python -m pytest -v
# 12/12 PASSED ✅
```
