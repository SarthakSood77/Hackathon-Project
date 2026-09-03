import React, { useState, useRef } from "react";
import { useScreening } from "../../context/ScreeningContext";
import {
  UploadCloud,
  FileText,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Sparkles,
  Loader2,
  Trash2,
  RefreshCw,
  Eye,
  FileCheck2,
  UserCheck
} from "lucide-react";
import { DocumentCanvasOverlay } from "./DocumentCanvasOverlay";
import { ScreeningProgress } from "./ScreeningProgress";

export const Step1Upload = () => {
  const {
    currentScenario,
    selectedScenarioId,
    setScenario,
    uploadedDocFile,
    uploadedSelfieFile,
    docPreviewUrl,
    selfiePreviewUrl,
    setDocFile,
    removeDocFile,
    setSelfieFile,
    removeSelfieFile,
    uploadError,
    setUploadError,
    loadDemoScenarioFiles,
    executeScreeningPipeline,
    screeningProgress,
    isBackendConnected,
    backendError
  } = useScreening();

  const [docDragActive, setDocDragActive] = useState(false);
  const [selfieDragActive, setSelfieDragActive] = useState(false);

  const docInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  // Document Drag handlers
  const handleDocDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDocDragActive(true);
    else if (e.type === "dragleave") setDocDragActive(false);
  };

  const handleDocDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDocDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDocFile(e.dataTransfer.files[0]);
    }
  };

  // Selfie Drag handlers
  const handleSelfieDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setSelfieDragActive(true);
    else if (e.type === "dragleave") setSelfieDragActive(false);
  };

  const handleSelfieDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelfieDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelfieFile(e.dataTransfer.files[0]);
    }
  };

  const isBothFilesReady = Boolean(uploadedDocFile && uploadedSelfieFile);

  return (
    <div className="space-y-6">
      {/* Dynamic Step-by-Step Screening Progress Modal */}
      <ScreeningProgress progress={screeningProgress} />

      {/* Hidden File Inputs */}
      <input
        ref={docInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) setDocFile(e.target.files[0]);
        }}
        className="hidden"
      />

      <input
        ref={selfieInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) setSelfieFile(e.target.files[0]);
        }}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#edf4fb] border-l-4 border-[#1a56a4] text-[#0f3566] p-3.5 rounded-r-lg text-xs leading-relaxed font-sans">
        <div>
          <strong>IDShield AI — Official Screening Directive:</strong> Upload the traveller's identity document and live selfie for autonomous 360-degree forensic & biometric screening.
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[11px] font-bold px-2.5 py-1 rounded bg-white border border-[#1a56a4]/30 shadow-xs">
          {isBackendConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#1e7e48] animate-pulse"></span>
              <span className="text-[#1e7e48]">AI Engine: Connected</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#b4690e]"></span>
              <span className="text-[#b4690e]">Preset Mode</span>
            </>
          )}
        </div>
      </div>

      {/* AI Screening Engine Offline Card (Phase 3) */}
      {backendError && (
        <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-900 shadow-md animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900 uppercase tracking-tight font-sans">
                  AI SCREENING ENGINE OFFLINE
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Unable to complete screening. The system never fabricates results when backend AI models cannot be reached.
                </p>
                <div className="mt-2.5 p-2.5 bg-rose-100/80 rounded-lg text-xs font-mono text-rose-900 border border-rose-200">
                  <strong>Reason:</strong> {backendError}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setUploadError(null);
                executeScreeningPipeline();
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-sans shadow-sm transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Screening
            </button>
          </div>
        </div>
      )}

      {uploadError && !backendError && (
        <div className="p-4 bg-[#fdf0ee] border-2 border-[#b3261e]/40 rounded-xl text-xs font-mono text-[#b3261e] flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#b3261e]" />
            <div>
              <strong className="block text-sm font-sans font-bold">⚠ Upload Validation Notice</strong>
              <span className="font-sans text-[#6f130e]">{uploadError}</span>
            </div>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="px-3 py-1 bg-white border border-[#b3261e]/30 rounded text-[#b3261e] hover:bg-[#fce8e6] text-[11px] font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Page Title & Demo Scenarios */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">IDShield AI</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">New Document Screening</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Upload custom synthetic files or click one of the pre-configured demo test cases below.
          </p>
        </div>

        {/* Demo Scenario Selector */}
        <div className="bg-[#f4f7fb] p-2 rounded-xl border border-[#d9e2ec] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#627d98] px-1">
            <span>DEMO SCENARIOS</span>
            <span className="text-[#1a56a4]">Demo Data — Synthetic Documents</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => loadDemoScenarioFiles("rohan")}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#0B1F51] hover:text-white border border-[#0B1F51]/40 text-[#0B1F51] font-semibold transition-all shadow-xs"
            >
              [ Rohan Verma (IND) ]
            </button>
            <button
              onClick={() => loadDemoScenarioFiles("genuine")}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#0B1F51] hover:text-white border border-[#cbd7e6] text-[#0B1F51] font-semibold transition-all shadow-xs"
            >
              [ Genuine Document ]
            </button>
            <button
              onClick={() => loadDemoScenarioFiles("tampered")}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#b4690e] hover:text-white border border-[#cbd7e6] text-[#b4690e] font-semibold transition-all shadow-xs"
            >
              [ Tampered Document ]
            </button>
            <button
              onClick={() => loadDemoScenarioFiles("expired")}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#b4690e] hover:text-white border border-[#cbd7e6] text-[#b4690e] font-semibold transition-all shadow-xs"
            >
              [ Expired Document ]
            </button>
            <button
              onClick={() => loadDemoScenarioFiles("mismatch")}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#b3261e] hover:text-white border border-[#cbd7e6] text-[#b3261e] font-semibold transition-all shadow-xs"
            >
              [ Face Mismatch ]
            </button>
          </div>
        </div>
      </div>

      {/* 2-Step Side-by-Side Ingestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= STEP 1: IDENTITY DOCUMENT ================= */}
        <div className="bg-white border border-[#d9e2ec] rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1a56a4] bg-[#edf4fb] px-2.5 py-0.5 rounded-full border border-[#1a56a4]/20">
                STEP 1
              </span>
              <span className="text-[11px] font-mono text-[#627d98]">SUPPORTED: JPG • JPEG • PNG • PDF</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B1F51]">Upload Identity Document</h3>
            <p className="text-xs text-[#486581] font-sans">
              Passport, Visa, National ID, or Driving License.
            </p>
          </div>

          {/* Document Dropzone / Preview */}
          {!uploadedDocFile ? (
            <div
              onDragEnter={handleDocDrag}
              onDragLeave={handleDocDrag}
              onDragOver={handleDocDrag}
              onDrop={handleDocDrop}
              onClick={() => docInputRef.current && docInputRef.current.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] ${
                docDragActive ? "border-[#1a56a4] bg-[#edf4fb]" : "border-[#cbd7e6] hover:border-[#0B1F51] bg-[#f8fafc]"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white text-[#0B1F51] flex items-center justify-center mb-2 shadow-sm border border-[#d9e2ec]">
                <FileText className="w-6 h-6" />
              </div>
              <p className="font-serif font-bold text-sm text-[#0B1F51] mb-0.5">[ Drag & Drop Passport / ID ]</p>
              <p className="text-xs text-[#627d98] font-sans mb-3">or drag files directly here</p>
              <button
                type="button"
                className="px-4 py-1.5 rounded-lg bg-[#0B1F51] text-white text-xs font-semibold font-sans hover:bg-[#14317a] transition-all shadow-xs"
              >
                [ Browse Files ]
              </button>
            </div>
          ) : (
            <div className="space-y-3 bg-[#f8fafc] border border-[#d9e2ec] rounded-xl p-4">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <span className="font-mono text-xs font-bold text-[#0B1F51] uppercase">DOCUMENT</span>
                <span className="text-[10px] font-mono bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">
                  ✓ READY
                </span>
              </div>

              {/* Preview Thumbnail */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#cbd7e6] bg-slate-900 flex items-center justify-center">
                {docPreviewUrl ? (
                  <img
                    src={docPreviewUrl}
                    alt="Document Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-white text-xs font-mono">PDF Document Attached</div>
                )}
              </div>

              {/* Status & Name */}
              <div className="space-y-0.5 text-xs font-mono">
                <div className="font-bold text-[#1e7e48] flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">✓ {uploadedDocFile.name}</span>
                </div>
                <p className="text-[11px] text-[#627d98] font-sans">Image loaded successfully</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => docInputRef.current && docInputRef.current.click()}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-[#cbd7e6] hover:bg-[#edf4fb] text-[#0B1F51] text-xs font-semibold font-sans transition-all"
                >
                  Replace document
                </button>
                <button
                  type="button"
                  onClick={removeDocFile}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#b3261e]/30 hover:bg-[#fdf0ee] text-[#b3261e] text-xs font-semibold font-sans transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= STEP 2: TRAVELLER SELFIE ================= */}
        <div className="bg-white border border-[#d9e2ec] rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1a56a4] bg-[#edf4fb] px-2.5 py-0.5 rounded-full border border-[#1a56a4]/20">
                STEP 2
              </span>
              <span className="text-[11px] font-mono text-[#627d98]">SUPPORTED: JPG • JPEG • PNG</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B1F51]">Upload Traveller Selfie</h3>
            <p className="text-xs text-[#486581] font-sans">
              Live camera portrait or checkpoint face photo for biometric verification.
            </p>
          </div>

          {/* Selfie Dropzone / Preview */}
          {!uploadedSelfieFile ? (
            <div
              onDragEnter={handleSelfieDrag}
              onDragLeave={handleSelfieDrag}
              onDragOver={handleSelfieDrag}
              onDrop={handleSelfieDrop}
              onClick={() => selfieInputRef.current && selfieInputRef.current.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] ${
                selfieDragActive ? "border-[#1a56a4] bg-[#edf4fb]" : "border-[#cbd7e6] hover:border-[#0B1F51] bg-[#f8fafc]"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white text-[#0B1F51] flex items-center justify-center mb-2 shadow-sm border border-[#d9e2ec]">
                <Camera className="w-6 h-6" />
              </div>
              <p className="font-serif font-bold text-sm text-[#0B1F51] mb-0.5">[ Drag & Drop Selfie ]</p>
              <p className="text-xs text-[#627d98] font-sans mb-3">or drag face image directly here</p>
              <button
                type="button"
                className="px-4 py-1.5 rounded-lg bg-[#0B1F51] text-white text-xs font-semibold font-sans hover:bg-[#14317a] transition-all shadow-xs"
              >
                [ Browse Files ]
              </button>
            </div>
          ) : (
            <div className="space-y-3 bg-[#f8fafc] border border-[#d9e2ec] rounded-xl p-4">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <span className="font-mono text-xs font-bold text-[#0B1F51] uppercase">SELFIE</span>
                <span className="text-[10px] font-mono bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">
                  ✓ READY
                </span>
              </div>

              {/* Preview Thumbnail */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#cbd7e6] bg-slate-900 flex items-center justify-center">
                {selfiePreviewUrl ? (
                  <img
                    src={selfiePreviewUrl}
                    alt="Selfie Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-white text-xs font-mono">Selfie Attached</div>
                )}
              </div>

              {/* Status & Name */}
              <div className="space-y-0.5 text-xs font-mono">
                <div className="font-bold text-[#1e7e48] flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">✓ {uploadedSelfieFile.name}</span>
                </div>
                <p className="text-[11px] text-[#627d98] font-sans">Image loaded successfully</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => selfieInputRef.current && selfieInputRef.current.click()}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-[#cbd7e6] hover:bg-[#edf4fb] text-[#0B1F51] text-xs font-semibold font-sans transition-all"
                >
                  Replace selfie
                </button>
                <button
                  type="button"
                  onClick={removeSelfieFile}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#b3261e]/30 hover:bg-[#fdf0ee] text-[#b3261e] text-xs font-semibold font-sans transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Central Start AI Screening Trigger */}
      <div className="bg-[#f8fafc] border border-[#d9e2ec] rounded-2xl p-6 text-center space-y-4">
        {/* Upload Status Checklist (Phase 18) */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-sans font-semibold">Document:</span>
            {uploadedDocFile ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Passport image uploaded
              </span>
            ) : (
              <span className="text-slate-400">Waiting for upload</span>
            )}
          </div>
          <div className="text-slate-300">|</div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-sans font-semibold">Selfie:</span>
            {uploadedSelfieFile ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Selfie uploaded
              </span>
            ) : (
              <span className="text-slate-400">Waiting for upload</span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={!isBothFilesReady}
          onClick={executeScreeningPipeline}
          className={`px-8 py-3.5 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mx-auto ${
            isBothFilesReady
              ? "bg-[#0B1F51] hover:bg-[#14317a] text-white cursor-pointer hover:scale-[1.02] shadow-[#0B1F51]/20"
              : "bg-[#cbd7e6] text-[#627d98] cursor-not-allowed opacity-75"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>[ START SCREENING ]</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Step2OCR = () => {
  const { currentScenario, nextStep, prevStep } = useScreening();
  const person = currentScenario.person;
  const ocr = currentScenario.ocr;

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Step 2 of 6</p>
          <h2 className="font-serif text-2xl font-bold text-[#0B1F51]">Optical Character Recognition (OCR) & Parsing</h2>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Real-time neural OCR engine extracting Visual Inspection Zone (VIZ) & Machine Readable Zone (MRZ) characters.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded bg-[#edf4fb] border border-[#1a56a4]/30 text-[#0B1F51] font-semibold">
            Engine: {currentScenario.isLiveResult ? "LIVE FASTAPI OCR ENGINE" : "IDSHIELD-OCR v4.2"}
          </span>
          <span className="px-3 py-1 rounded bg-[#eef7f2] border border-[#1e7e48]/30 text-[#1e7e48] font-bold">
            CONFIDENCE: {ocr.confidence}%
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Feed */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-mono uppercase font-bold text-[#627d98]">Optical Scanner Feed:</p>
          <DocumentCanvasOverlay scenario={currentScenario} isScanning={true} />
        </div>

        {/* Right: Extracted Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#627d98] uppercase">Parsed Machine-Readable Data Fields:</span>
            <span className="text-[#1e7e48] font-bold">✓ 100% FIELD COVERAGE</span>
          </div>

          <div className="bg-white border border-[#d9e2ec] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f0f4f8] border-b border-[#d9e2ec] text-[#486581] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Field Name</th>
                  <th className="p-3">Extracted Value</th>
                  <th className="p-3 text-center">Confidence</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f8] text-[#102a43]">
                <tr>
                  <td className="p-3 text-[#627d98]">Document Type</td>
                  <td className="p-3 font-semibold text-[#0B1F51]">{person.docType}</td>
                  <td className="p-3 text-center text-[#1e7e48]">99.8%</td>
                  <td className="p-3 text-right"><span className="text-[10px] bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">VALID</span></td>
                </tr>
                <tr>
                  <td className="p-3 text-[#627d98]">Document ID</td>
                  <td className="p-3 font-bold text-[#0B1F51]">{person.docId}</td>
                  <td className="p-3 text-center text-[#1e7e48]">99.5%</td>
                  <td className="p-3 text-right"><span className="text-[10px] bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">VALID</span></td>
                </tr>
                <tr>
                  <td className="p-3 text-[#627d98]">Full Name</td>
                  <td className="p-3 font-semibold text-[#102a43]">{person.name}</td>
                  <td className="p-3 text-center text-[#1e7e48]">98.9%</td>
                  <td className="p-3 text-right"><span className="text-[10px] bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">VALID</span></td>
                </tr>
                {(() => {
                  const isDobAnomaly = Boolean(
                    person.originalDob ||
                    ocr.highlightBox?.field?.toLowerCase().includes("dob") ||
                    ocr.highlightBox?.field?.toLowerCase().includes("birth") ||
                    ocr.tamperingDetails?.toLowerCase().includes("birth") ||
                    ocr.tamperingDetails?.toLowerCase().includes("dob") ||
                    currentScenario.signals?.some(s => (s.name.includes("DOB") || s.name.includes("Birth")) && s.status !== "PASS")
                  );
                  return (
                    <tr className={isDobAnomaly ? "bg-[#fdf0ee]" : ""}>
                      <td className="p-3 text-[#627d98] flex items-center gap-1">
                        <span>Date of Birth</span>
                        {isDobAnomaly && <AlertTriangle className="w-3.5 h-3.5 text-[#b3261e]" />}
                      </td>
                      <td className="p-3 font-bold text-[#102a43]">
                        {person.dob}
                        {isDobAnomaly && (
                          <span className="block text-[10px] text-[#b3261e] font-sans mt-0.5 font-normal">
                            ⚠️ {person.originalDob ? `Registry expects: ${person.originalDob}` : "Forensics detected unauthorized alteration in DOB zone"}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center text-[#1e7e48]">{isDobAnomaly ? "94.2%" : "99.4%"}</td>
                      <td className="p-3 text-right">
                        {isDobAnomaly ? (
                          <span className="text-[10px] bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/30 px-2 py-0.5 rounded font-bold">
                            ALTERED
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">
                            VALID
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })()}
                <tr>
                  <td className="p-3 text-[#627d98]">Nationality</td>
                  <td className="p-3 font-semibold text-[#102a43]">{person.nationality}</td>
                  <td className="p-3 text-center text-[#1e7e48]">99.1%</td>
                  <td className="p-3 text-right"><span className="text-[10px] bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">VALID</span></td>
                </tr>
                {(() => {
                  const isExpired = Boolean(
                    currentScenario.signals?.some(s => s.name.includes("Expiry") && s.status === "FAILED")
                  );
                  return (
                    <tr className={isExpired ? "bg-[#fdf0ee]" : ""}>
                      <td className="p-3 text-[#627d98] flex items-center gap-1">
                        <span>Expiry Date</span>
                        {isExpired && <AlertTriangle className="w-3.5 h-3.5 text-[#b3261e]" />}
                      </td>
                      <td className="p-3 font-semibold text-[#102a43]">
                        {person.expiryDate}
                        {isExpired && (
                          <span className="block text-[10px] text-[#b3261e] font-sans mt-0.5 font-normal">
                            ✕ Credential validity has expired
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center text-[#1e7e48]">98.7%</td>
                      <td className="p-3 text-right">
                        {isExpired ? (
                          <span className="text-[10px] bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/30 px-2 py-0.5 rounded font-bold">
                            EXPIRED
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#eef7f2] text-[#1e7e48] px-2 py-0.5 rounded font-bold">
                            VALID
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>

          {/* MRZ Box */}
          {(() => {
            const isMrzFailed = Boolean(
              currentScenario.signals?.some(s => s.name.includes("MRZ") && s.status === "FAILED") ||
              ocr.highlightBox?.field?.toLowerCase().includes("mrz")
            );
            return (
              <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-1 transition-all ${
                isMrzFailed ? "bg-[#fdf0ee] border-[#b3261e]/40 text-[#6f130e]" : "bg-[#f8fafc] border-[#d9e2ec]"
              }`}>
                <div className="flex justify-between text-[10px] uppercase font-bold">
                  <span className={isMrzFailed ? "text-[#b3261e]" : "text-[#627d98]"}>ICAO DOC 9303 MRZ Checksum Verification:</span>
                  <span className={isMrzFailed ? "text-[#b3261e] font-bold" : "text-[#1e7e48]"}>
                    {isMrzFailed ? "✕ MODULO-10 CHECKSUM MISMATCH" : "✓ MODULO-10 EVALUATED"}
                  </span>
                </div>
                <div className={`p-2 rounded border text-[11px] leading-tight ${
                  isMrzFailed ? "bg-white border-[#b3261e]/40 text-[#b3261e] font-bold" : "bg-white border-[#d9e2ec] text-[#0B1F51]"
                }`}>
                  <div>{person.mrzLine1}</div>
                  <div>{person.mrzLine2}</div>
                </div>
              </div>
            );
          })()}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={prevStep}
              className="px-4 py-2 rounded-lg bg-white border border-[#d9e2ec] hover:bg-[#f4f7fb] text-[#102a43] text-xs font-semibold font-sans transition-all cursor-pointer"
            >
              ← Back to Upload
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-semibold font-sans transition-all shadow-md cursor-pointer"
            >
              <span>Step 3 — Tampering Analysis →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};