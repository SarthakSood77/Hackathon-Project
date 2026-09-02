import React, { useState } from "react";
import { useScreening } from "../../context/ScreeningContext";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Camera,
  RefreshCw,
  ArrowRight,
  Fingerprint,
  Sparkles,
  Lock,
  UserCheck,
  UserX,
  Scan
} from "lucide-react";
import { DocumentCanvasOverlay } from "./DocumentCanvasOverlay";
import { Badge } from "../common/Badge";

export const Step3TamperAnalysis = () => {
  const { currentScenario, docPreviewUrl, nextStep, prevStep } = useScreening();
  const ocr = currentScenario.ocr;
  const signals = currentScenario.signals;
  const isTampered = ocr.tamperingDetected;
  const person = currentScenario.person;

  // ELA / Tampering Anomaly region indicators
  const detectedRegions = [
    { region: "Photo Region", level: "LOW", status: "NORMAL", color: "text-[#1e7e48] bg-[#eef7f2]" },
    { region: "Date of Birth", level: isTampered ? "HIGH" : "LOW", status: isTampered ? "ANOMALY DETECTED" : "NORMAL", color: isTampered ? "text-[#b3261e] bg-[#fdf0ee]" : "text-[#1e7e48] bg-[#eef7f2]" },
    { region: "MRZ Zone", level: "NORMAL", status: "NORMAL", color: "text-[#1e7e48] bg-[#eef7f2]" },
    { region: "Signature / Seals", level: "NORMAL", status: "NORMAL", color: "text-[#1e7e48] bg-[#eef7f2]" },
    { region: "Background Substrate", level: isTampered ? "MEDIUM" : "NORMAL", status: isTampered ? "NOISE DISCONTINUITY" : "NORMAL", color: isTampered ? "text-[#b4690e] bg-[#fdf8eb]" : "text-[#1e7e48] bg-[#eef7f2]" }
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Step 3 of 6</p>
          <h2 className="font-serif text-2xl font-bold text-[#0B1F51]">DOCUMENT FORENSICS & TAMPERING ANALYSIS</h2>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Error Level Analysis (ELA), pixel interpolation variance, EXIF signature & spectral boundary inspection.
          </p>
        </div>

        <div>
          {isTampered ? (
            <Badge variant="highRisk" size="lg">
              ⚠️ TAMPERING DETECTED
            </Badge>
          ) : (
            <Badge variant="verified" size="lg">
              ✓ INTEGRITY VERIFIED
            </Badge>
          )}
        </div>
      </div>

      {/* Side-by-Side: Original Document vs Forensic Analysis */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-[#0B1F51] uppercase">DOCUMENT FORENSICS (ORIGINAL vs ELA RESIDUALS)</span>
          <span className="text-[#627d98] font-semibold">ALGORITHM: 95% RECOMPRESSION ELA GRADIENT</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Original Document */}
          <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0B1F51] uppercase">Original Document</span>
              <span className="text-[10px] font-mono bg-[#edf4fb] text-[#1a56a4] px-2 py-0.5 rounded font-bold">
                [ ORIGINAL ]
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#cbd7e6] bg-slate-950 flex items-center justify-center">
              <img
                src={docPreviewUrl || person.avatarUrl}
                alt="Original Document"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-[11px] font-mono text-[#627d98] flex justify-between">
              <span>DOC REF: {person.docId}</span>
              <span>NAME: {person.name}</span>
            </div>
          </div>

          {/* Right: Forensic ELA Heatmap */}
          <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0B1F51] uppercase">Forensic Analysis (ELA / Heatmap)</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isTampered ? "bg-[#fdf0ee] text-[#b3261e]" : "bg-[#eef7f2] text-[#1e7e48]"
              }`}>
                [ {isTampered ? "ELA ANOMALY" : "UNIFORM GRADIENT"} ]
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#0B1F51] bg-black flex items-center justify-center">
              {currentScenario.elaHeatmapUrl ? (
                <img
                  src={currentScenario.elaHeatmapUrl}
                  alt="Error Level Analysis Heatmap"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                  <div className="space-y-2">
                    <Scan className={`w-12 h-12 mx-auto ${isTampered ? "text-[#b3261e]" : "text-[#1e7e48]"} animate-pulse`} />
                    <p className="text-white font-mono text-xs font-bold">
                      {isTampered ? "HIGH-FREQUENCY RECOMPRESSION ANOMALIES" : "UNIFORM COMPRESSION RESIDUALS"}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {isTampered ? "Localized pixel modification detected in Date of Birth zone." : "No spatial or metadata splicing artifacts."}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="text-[11px] font-mono text-[#627d98] flex justify-between">
              <span>TAMPER RISK: {isTampered ? "HIGH (65/100)" : "LOW (<10/100)"}</span>
              <span>NOISE: LAPLACIAN 84.2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Anomaly Regions Table */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono uppercase font-bold text-[#627d98] block">
          Detected Regional Forensic Status:
        </span>

        <div className="bg-white border border-[#d9e2ec] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#f0f4f8] border-b border-[#d9e2ec] text-[#486581] uppercase text-[10px]">
              <tr>
                <th className="p-3">Inspection Region</th>
                <th className="p-3 text-center">Threat Level</th>
                <th className="p-3 text-right">Forensic State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f8]">
              {detectedRegions.map((item, i) => (
                <tr key={i} className="hover:bg-[#f8fafc]">
                  <td className="p-3 font-semibold text-[#102a43]">{item.region}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${item.color}`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`font-bold ${item.status.includes("ANOMALY") ? "text-[#b3261e]" : "text-[#1e7e48]"}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-[#d9e2ec]">
        <button
          onClick={prevStep}
          className="px-4 py-2 rounded-lg bg-white border border-[#d9e2ec] hover:bg-[#f4f7fb] text-[#102a43] text-xs font-semibold font-sans transition-all cursor-pointer"
        >
          ← Back to OCR
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-semibold font-sans transition-all shadow-md cursor-pointer"
        >
          <span>Continue to Step 4 — Face Verification →</span>
        </button>
      </div>
    </div>
  );
};

export const Step4FaceVerification = () => {
  const { currentScenario, docPreviewUrl, selfiePreviewUrl, nextStep, prevStep } = useScreening();
  const [isCapturing, setIsCapturing] = useState(false);
  const person = currentScenario.person;
  const bio = currentScenario.biometrics;
  const isTampered = Boolean(currentScenario.ocr?.tamperingDetected || currentScenario.riskBreakdown?.some(r => r.name.includes("Tamper") && r.value > 10) || currentScenario.riskScore >= 40);
  const isMatch = bio.faceMatch >= 80 && !isTampered;

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Step 4 of 6</p>
          <h2 className="font-serif text-2xl font-bold text-[#0B1F51]">DOCUMENT & BIOMETRIC FACE COMPARISON</h2>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            1:1 Facial landmark concordance and anti-spoofing presentation attack detection between document photo and live selfie.
          </p>
        </div>

        <div>
          {isMatch ? (
            <Badge variant="verified" size="lg">
              ✓ BIOMETRIC MATCH ({bio.faceMatch}%)
            </Badge>
          ) : (
            <Badge variant="highRisk" size="lg">
              ✕ {isTampered ? "PHOTO MODIFIED / INVALIDATED" : `BIOMETRIC MISMATCH (${bio.faceMatch}%)`}
            </Badge>
          )}
        </div>
      </div>

      {/* Side-by-Side: DOCUMENT vs SELFIE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DOCUMENT PHOTO */}
        <div className="bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#0B1F51]">DOCUMENT PHOTO</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              isTampered ? "bg-[#fdf0ee] text-[#b3261e]" : "bg-[#edf4fb] text-[#1a56a4]"
            }`}>
              [ {isTampered ? "TAMPERED / SEAM DETECTED" : "Passport Preview"} ]
            </span>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#d9e2ec] bg-slate-950 flex items-center justify-center">
            <img
              src={docPreviewUrl || person.avatarUrl}
              alt="Document Portrait"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 left-2 text-white text-[11px] font-mono bg-black/75 px-2 py-1 rounded">
              {person.name} • {person.docId}
            </div>
            {isTampered && (
              <div className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                ⚠️ PHOTO ALTERED
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs font-mono text-[#627d98]">
            <span>ICAO ISO 19794-5 COMPLIANT</span>
            <span className={isTampered ? "text-[#b3261e] font-bold" : "text-[#1e7e48]"}>
              {isTampered ? "DISCONTINUITY DETECTED" : "ENROLLED REFERENCE"}
            </span>
          </div>
        </div>

        {/* SELFIE PHOTO */}
        <div className="bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#0B1F51]">TRAVELLER SELFIE</span>
            <span className="text-[10px] font-mono bg-[#edf4fb] text-[#1a56a4] px-2 py-0.5 rounded font-bold">
              [ Selfie Preview ]
            </span>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#0B1F51] bg-slate-950 flex items-center justify-center">
            <img
              src={selfiePreviewUrl || person.liveCameraUrl}
              alt="Traveller Selfie"
              className="w-full h-full object-contain"
            />

            {/* Bounding Box overlay */}
            <div
              className={`absolute inset-6 rounded border-2 flex flex-col justify-between p-2 pointer-events-none ${
                isMatch ? "border-[#1e7e48] shadow-[0_0_15px_rgba(30,126,72,0.4)]" : "border-[#b3261e] shadow-[0_0_20px_rgba(179,38,30,0.5)]"
              }`}
            >
              <div className="flex justify-between text-[9px] font-mono font-bold bg-white/90 text-[#0B1F51] px-1 py-0.5 rounded">
                <span>{isMatch ? "LOCKED [98%]" : (isTampered ? "INVALIDATED" : "MISMATCH")}</span>
                <span>68 LANDMARKS</span>
              </div>
              <div className="text-[9px] font-mono text-white bg-black/70 px-1 rounded">
                LIVENESS: {bio.livenessScore || 98}%
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-[#627d98]">
            <span>ANTI-SPOOF: {bio.antiSpoofing}</span>
            <span className="text-[#1e7e48]">ACTIVE SENSOR</span>
          </div>
        </div>
      </div>

      {/* Face Verification Result Bar */}
      <div
        className={`p-6 rounded-2xl border-2 space-y-4 ${
          isMatch ? "bg-[#eef7f2] border-[#1e7e48]/50" : "bg-[#fdf0ee] border-[#b3261e]/50"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#627d98] block">
              BIOMETRIC EVALUATION
            </span>
            <h3 className={`font-serif text-xl font-bold ${isMatch ? "text-[#1e7e48]" : "text-[#b3261e]"}`}>
              {isMatch 
                ? "✓ FACE MATCH CONFIRMED" 
                : (isTampered 
                  ? "✕ BIOMETRIC VERIFICATION INVALIDATED: DOCUMENT PHOTO MODIFIED" 
                  : "✕ BIOMETRIC FACE MISMATCH")}
            </h3>
            <p className="text-xs text-[#486581] font-sans mt-0.5">
              Similarity: <strong>{isMatch ? bio.faceMatch : Math.min(32, bio.faceMatch)}%</strong> (Passing threshold: 80.0%)
            </p>
          </div>

          <div className="text-right">
            <span className={`text-2xl font-serif font-bold ${isMatch ? "text-[#1e7e48]" : "text-[#b3261e]"}`}>
              {isMatch ? bio.faceMatch : Math.min(32, bio.faceMatch)}%
            </span>
            <span className="text-[10px] font-mono text-[#627d98] block">CONFIDENCE SCORE</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-3 rounded-full bg-black/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isMatch ? "bg-[#1e7e48]" : "bg-[#b3261e]"
              }`}
              style={{ width: `${isMatch ? bio.faceMatch : Math.min(32, bio.faceMatch)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#627d98]">
            <span>0% (Dissimilar)</span>
            <span>Threshold: 80%</span>
            <span>100% (Identical)</span>
          </div>
        </div>

        <p className="text-xs text-[#486581] font-sans bg-white/70 p-3 rounded-lg border border-black/5">
          {bio.confidenceText}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={prevStep}
          className="px-4 py-2 rounded-lg bg-white border border-[#d9e2ec] hover:bg-[#f4f7fb] text-[#102a43] text-xs font-semibold font-sans transition-all cursor-pointer"
        >
          ← Back to Tampering Analysis
        </button>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-semibold font-sans transition-all shadow-md cursor-pointer"
        >
          <span>Continue to Step 5 — Risk Assessment →</span>
        </button>
      </div>
    </div>
  );
};