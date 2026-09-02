# =====================================================
# SENTINEL AI — Full Stack Startup Script
# Run this from D:\Codes\Az in PowerShell
# =====================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         SENTINEL AI — BORDER GUARD AI        ║" -ForegroundColor Cyan
Write-Host "║     AI-Powered Identity & Document Screening  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# --- Start Backend (FastAPI) ---
Write-Host "[1/2] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Yellow
$uvicornCmd = if (Test-Path "$PSScriptRoot\backend\.venv\Scripts\uvicorn.exe") { "$PSScriptRoot\backend\.venv\Scripts\uvicorn.exe" } else { "uvicorn" }
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; & '$uvicornCmd' app.main:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Normal

Start-Sleep -Seconds 2

# --- Serve Frontend (pre-built dist) ---
Write-Host "[2/2] Serving Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m http.server 5173 --directory '$PSScriptRoot\dist'" -WindowStyle Normal

Start-Sleep -Seconds 2

# --- Open Browser ---
Write-Host ""
Write-Host "✅ Opening Sentinel AI in your browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "  Frontend  → http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend   → http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs  → http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
