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
  const ocr = currentScenario.ocr || {};
  const signals = currentScenario.signals || [];
  const isTampered = Boolean(ocr.tamperingDetected);
  const person = currentScenario.person || {};

  // Specific regional anomaly checks derived from actual signals and anomaly details
  const isDobAnomaly = Boolean(
    signals.some(s => (s.name.includes("DOB") || s.name.includes("Birth")) && s.status === "FAILED") ||
    ocr.tamperingDetails?.toLowerCase().includes("date of birth") ||
    ocr.tamperingDetails?.toLowerCase().includes("dob") ||
    ocr.highlightBox?.field?.toLowerCase().includes("dob") ||
    ocr.highlightBox?.field?.toLowerCase().includes("birth")
  );
  const isPhotoAnomaly = Boolean(
    signals.some(s => s.name.includes("Photo") && s.status !== "PASS") ||
    ocr.tamperingDetails?.toLowerCase().includes("photo") ||
    ocr.tamperingDetails?.toLowerCase().includes("splice") ||
    ocr.highlightBox?.field?.toLowerCase().includes("photo")
  );
  const isMrzAnomaly = Boolean(
    signals.some(s => s.name.includes("MRZ") && s.status === "FAILED") ||
    ocr.highlightBox?.field?.toLowerCase().includes("mrz")
  );

  const detectedAnomaliesList = currentScenario.detectedAnomalies || [];

  // ELA / Tampering Anomaly region indicators
  const detectedRegions = [
    {
      region: "Photo Region",
      level: isPhotoAnomaly ? "HIGH" : "LOW",
      status: isPhotoAnomaly ? "POTENTIAL SEAM / SPLICE DETECTED" : "NORMAL",
      color: isPhotoAnomaly ? "text-[#b3261e] bg-[#fdf0ee]" : "text-[#1e7e48] bg-[#eef7f2]"
    },
    {
      region: "Date of Birth Zone",
      level: isDobAnomaly ? "HIGH" : "LOW",
      status: isDobAnomaly ? "ALTERATION ANOMALY DETECTED" : "NORMAL",
      color: isDobAnomaly ? "text-[#b3261e] bg-[#fdf0ee]" : "text-[#1e7e48] bg-[#eef7f2]"
    },
    {
      region: "Machine Readable Zone (MRZ)",
      level: isMrzAnomaly ? "HIGH" : "NORMAL",
      status: isMrzAnomaly ? "CHECKSUM MISMATCH / ALTERATION" : "NORMAL",
      color: isMrzAnomaly ? "text-[#b3261e] bg-[#fdf0ee]" : "text-[#1e7e48] bg-[#eef7f2]"
    },
    {
      region: "Signature & Official Seals",
      level: "NORMAL",
      status: "NORMAL",
      color: "text-[#1e7e48] bg-[#eef7f2]"
    },
    {
      region: "Background Substrate & Compression",
      level: isTampered ? "HIGH" : "NORMAL",
      status: isTampered ? "HIGH-FREQUENCY COMPRESSION ANOMALIES" : "UNIFORM RESIDUAL GRADIENT",
      color: isTampered ? "text-[#b3261e] bg-[#fdf0ee]" : "text-[#1e7e48] bg-[#eef7f2]"
    }
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
              ⚠️ POTENTIAL MANIPULATION DETECTED
            </Badge>
          ) : (
            <Badge variant="verified" size="lg">
              ✓ INTEGRITY VERIFIED
            </Badge>
          )}
        </div>
      </div>

      {/* Forensic Findings Banner */}
      {isTampered && (
        <div className="p-4 bg-[#fdf0ee] border-2 border-[#b3261e]/40 rounded-xl space-y-2 text-xs font-sans shadow-sm">
          <div className="flex items-center gap-2 text-[#b3261e] font-bold font-serif text-sm">
            <ShieldAlert className="w-4 h-4 text-[#b3261e]" />
            <span>Forensic Tampering Flags Detected</span>
          </div>
          <div className="text-[#6f130e] font-mono text-[11px] leading-relaxed">
            {detectedAnomaliesList.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {detectedAnomaliesList.map((a, idx) => (
                  <li key={idx} className="font-bold">{a}</li>
                ))}
              </ul>
            ) : (
              <p className="font-bold">{ocr.tamperingDetails}</p>
            )}
          </div>
        </div>
      )}

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
                      {isTampered ? (ocr.tamperingDetails || "Potential localized pixel modification detected.") : "No spatial or metadata splicing artifacts."}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="text-[11px] font-mono text-[#627d98] flex justify-between">
              <span>TAMPER RISK: {isTampered ? `ELEVATED (${Math.round(currentScenario.riskScore || 65)}/100)` : "LOW (<10/100)"}</span>
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
  
  const isPhotoTampered = Boolean(
    currentScenario.signals?.some(s => s.name.includes("Photo") && s.status !== "PASS") ||
    currentScenario.ocr?.tamperingDetails?.toLowerCase().includes("photo") ||
    currentScenario.ocr?.tamperingDetails?.toLowerCase().includes("splice") ||
    currentScenario.ocr?.highlightBox?.field?.toLowerCase().includes("photo")
  );
  
  const isDocTampered = Boolean(
    currentScenario.ocr?.tamperingDetected ||
    currentScenario.signals?.some(s => s.status === "FAILED" || (s.name.includes("Authenticity") && s.status !== "PASS"))
  );
  
  const isRawFaceMatch = (bio.faceMatch >= 80) || (bio.status === "VERIFIED");
  const isCleanMatch = isRawFaceMatch && !isPhotoTampered && !isDocTampered;

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
          {isPhotoTampered ? (
            <Badge variant="highRisk" size="lg">
              ⚠️ PHOTO SPLICED — BIOMETRICS COMPROMISED
            </Badge>
          ) : !isRawFaceMatch ? (
            <Badge variant="highRisk" size="lg">
              ✕ BIOMETRIC MISMATCH ({bio.faceMatch}%)
            </Badge>
          ) : isDocTampered ? (
            <Badge variant="suspicious" size="lg">
              ⚠️ MATCH ({bio.faceMatch}%) — CREDENTIAL ALTERED
            </Badge>
          ) : (
            <Badge variant="verified" size="lg">
              ✓ BIOMETRIC MATCH ({bio.faceMatch}%)
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
              isPhotoTampered 
                ? "bg-[#fdf0ee] text-[#b3261e]" 
                : isDocTampered 
                ? "bg-[#fdf8eb] text-[#b4690e]" 
                : "bg-[#edf4fb] text-[#1a56a4]"
            }`}>
              [ {isPhotoTampered ? "PHOTO ALTERED / SEAM DETECTED" : isDocTampered ? "CREDENTIAL ALTERED" : "Passport Preview"} ]
            </span>
          </div>

          <div className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 bg-slate-950 flex items-center justify-center ${
            isPhotoTampered ? "border-[#b3261e]" : isDocTampered ? "border-[#b4690e]" : "border-[#d9e2ec]"
          }`}>
            <img
              src={docPreviewUrl || person.avatarUrl}
              alt="Document Portrait"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 left-2 text-white text-[11px] font-mono bg-black/75 px-2 py-1 rounded">
              {person.name} • {person.docId}
            </div>
            {isPhotoTampered && (
              <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                ⚠️ PHOTO SEAM ALTERED
              </div>
            )}
            {!isPhotoTampered && isDocTampered && (
              <div className="absolute top-2 right-2 bg-amber-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                ⚠️ CREDENTIAL TAMPERED
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs font-mono text-[#627d98]">
            <span>ICAO ISO 19794-5 COMPLIANT</span>
            <span className={isPhotoTampered ? "text-[#b3261e] font-bold" : isDocTampered ? "text-[#b4690e] font-bold" : "text-[#1e7e48]"}>
              {isPhotoTampered ? "DISCONTINUITY DETECTED" : isDocTampered ? "METADATA ALTERED" : "ENROLLED REFERENCE"}
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
                isPhotoTampered || !isRawFaceMatch
                  ? "border-[#b3261e] shadow-[0_0_20px_rgba(179,38,30,0.5)]"
                  : isDocTampered
                  ? "border-[#b4690e] shadow-[0_0_15px_rgba(180,105,14,0.4)]"
                  : "border-[#1e7e48] shadow-[0_0_15px_rgba(30,126,72,0.4)]"
              }`}
            >
              <div className="flex justify-between text-[9px] font-mono font-bold bg-white/90 text-[#0B1F51] px-1 py-0.5 rounded">
                <span>
                  {isPhotoTampered 
                    ? "PHOTO COMPROMISED" 
                    : !isRawFaceMatch 
                    ? "MISMATCH" 
                    : isDocTampered 
                    ? "MATCH (ALTERED DOC)" 
                    : "LOCKED [98%]"}
                </span>
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
          isPhotoTampered || !isRawFaceMatch
            ? "bg-[#fdf0ee] border-[#b3261e]/50"
            : isDocTampered
            ? "bg-[#fdf8eb] border-[#b4690e]/50"
            : "bg-[#eef7f2] border-[#1e7e48]/50"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#627d98] block">
              BIOMETRIC EVALUATION
            </span>
            <h3 className={`font-serif text-xl font-bold ${
              isPhotoTampered || !isRawFaceMatch ? "text-[#b3261e]" : isDocTampered ? "text-[#b4690e]" : "text-[#1e7e48]"
            }`}>
              {isPhotoTampered 
                ? "⚠️ BIOMETRIC REFERENCE COMPROMISED (PHOTO SEAM DETECTED)" 
                : !isRawFaceMatch 
                ? "✕ BIOMETRIC FACE MISMATCH" 
                : isDocTampered 
                ? "⚠️ FACE MATCH CONFIRMED — CREDENTIAL TAMPERING DETECTED" 
                : "✓ FACE MATCH CONFIRMED"}
            </h3>
            <p className="text-xs text-[#486581] font-sans mt-0.5">
              Similarity: <strong>{bio.faceMatch}%</strong> (Passing threshold: 80.0%)
              {isPhotoTampered && " — Biometric comparison invalidated due to detected photo splicing."}
              {!isPhotoTampered && isDocTampered && " — Traveler matches photo, but credential contains altered data fields."}
            </p>
          </div>

          <div className="text-right">
            <span className={`text-2xl font-serif font-bold ${
              isPhotoTampered || !isRawFaceMatch ? "text-[#b3261e]" : isDocTampered ? "text-[#b4690e]" : "text-[#1e7e48]"
            }`}>
              {bio.faceMatch}%
            </span>
            <span className="text-[10px] font-mono text-[#627d98] block">
              {isPhotoTampered ? "COMPROMISED CONFIDENCE" : "CONFIDENCE SCORE"}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-3 rounded-full bg-black/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPhotoTampered || !isRawFaceMatch ? "bg-[#b3261e]" : isDocTampered ? "bg-[#b4690e]" : "bg-[#1e7e48]"
              }`}
              style={{ width: `${bio.faceMatch}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#627d98]">
            <span>0% (Dissimilar)</span>
            <span>Threshold: 80%</span>
            <span>100% (Identical)</span>
          </div>
        </div>

        <p className="text-xs text-[#486581] font-sans bg-white/70 p-3 rounded-lg border border-black/5">
          {isPhotoTampered
            ? "⚠️ Biometric Warning: The baseline photograph on the travel credential exhibits signs of physical or digital splicing. Although landmark algorithms calculate similarity, the match cannot be certified as authentic."
            : isDocTampered
            ? `Biometric facial comparison confirmed (${bio.faceMatch}% match). Note: Traveler identity is validated, but clearance is withheld due to detected document tampering.`
            : bio.confidenceText}
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