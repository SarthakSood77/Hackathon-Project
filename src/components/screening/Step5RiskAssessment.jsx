import React, { useState } from "react";
import { useScreening } from "../../context/ScreeningContext";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  FileText,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Flag,
  Printer,
  Download,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  Info
} from "lucide-react";
import { RiskGauge } from "../common/RiskGauge";
import { Badge } from "../common/Badge";

export const Step5RiskAssessment = () => {
  const { currentScenario, nextStep, prevStep, setReportModalOpen, setManualReviewModalOpen } = useScreening();
  const [explanationOpen, setExplanationOpen] = useState(true);

  const risk = currentScenario.riskScore;
  const isFaceMismatch = Boolean(currentScenario.biometrics && currentScenario.biometrics.faceMatch < 80);
  const isHighRisk = risk >= 66 || isFaceMismatch;
  const isSuspicious = !isHighRisk && risk >= 26;
  const screeningId = currentScenario.screeningId || "SEN-2026-000184";

  // Detailed individual checks
  const checksList = [
    {
      label: "DOCUMENT AUTHENTICITY",
      status: currentScenario.ocr.tamperingDetected ? "WARNING" : "PASSED",
      color: currentScenario.ocr.tamperingDetected ? "text-[#b4690e]" : "text-[#1e7e48]",
      badge: currentScenario.ocr.tamperingDetected ? "⚠ WARNING" : "✓ PASSED",
      badgeType: currentScenario.ocr.tamperingDetected ? "suspicious" : "verified",
      detail: currentScenario.ocr.tamperingDetected ? "Localized noise anomalies detected" : "Template structure verified"
    },
    {
      label: "OCR",
      status: "PASSED",
      color: "text-[#1e7e48]",
      badge: "✓ PASSED",
      badgeType: "verified",
      detail: `Extraction confidence ${currentScenario.ocr.confidence}%`
    },
    {
      label: "MRZ VALIDATION",
      status: currentScenario.signals.find(s => s.name.includes("MRZ"))?.status === "FAILED" ? "FAILED" : "PASSED",
      color: currentScenario.signals.find(s => s.name.includes("MRZ"))?.status === "FAILED" ? "text-[#b3261e]" : "text-[#1e7e48]",
      badge: currentScenario.signals.find(s => s.name.includes("MRZ"))?.status === "FAILED" ? "✕ FAILED" : "✓ PASSED",
      badgeType: currentScenario.signals.find(s => s.name.includes("MRZ"))?.status === "FAILED" ? "highRisk" : "verified",
      detail: currentScenario.signals.find(s => s.name.includes("MRZ"))?.status === "FAILED" ? "Modulo-10 check digit mismatch" : "Modulo-10 check digits verified"
    },
    {
      label: "DOCUMENT EXPIRY",
      status: currentScenario.signals.find(s => s.name.includes("Expiry"))?.status === "FAILED" ? "EXPIRED" : "VALID",
      color: currentScenario.signals.find(s => s.name.includes("Expiry"))?.status === "FAILED" ? "text-[#b3261e]" : "text-[#1e7e48]",
      badge: currentScenario.signals.find(s => s.name.includes("Expiry"))?.status === "FAILED" ? "✕ EXPIRED" : "✓ VALID",
      badgeType: currentScenario.signals.find(s => s.name.includes("Expiry"))?.status === "FAILED" ? "highRisk" : "verified",
      detail: currentScenario.signals.find(s => s.name.includes("Expiry"))?.status === "FAILED" ? `Expired on ${currentScenario.person.expiryDate}` : `Valid through ${currentScenario.person.expiryDate}`
    },
    {
      label: "TAMPERING ANALYSIS",
      status: isHighRisk ? "HIGH RISK" : isSuspicious ? "SUSPICIOUS" : "LOW RISK",
      color: isHighRisk ? "text-[#b3261e]" : isSuspicious ? "text-[#b4690e]" : "text-[#1e7e48]",
      badge: currentScenario.ocr.tamperingDetected ? "⚠ TAMPER DETECTED" : "✓ LOW RISK",
      badgeType: currentScenario.ocr.tamperingDetected ? "highRisk" : "verified",
      detail: currentScenario.ocr.tamperingDetected ? currentScenario.ocr.tamperingDetails : "Uniform ELA compression gradient"
    },
    {
      label: "FACE VERIFICATION",
      status: currentScenario.biometrics.faceMatch >= 80 ? "MATCH" : "MISMATCH",
      color: currentScenario.biometrics.faceMatch >= 80 ? "text-[#1e7e48]" : "text-[#b3261e]",
      badge: currentScenario.biometrics.faceMatch >= 80 ? `✓ MATCH ${currentScenario.biometrics.faceMatch}%` : `✕ MISMATCH ${currentScenario.biometrics.faceMatch}%`,
      badgeType: currentScenario.biometrics.faceMatch >= 80 ? "verified" : "highRisk",
      detail: `Facial concordance score: ${currentScenario.biometrics.faceMatch}%`
    },
    {
      label: "WATCHLIST",
      status: currentScenario.identitySearch.matchFound ? "MATCH HIT" : "NO MATCH",
      color: currentScenario.identitySearch.matchFound ? "text-[#b3261e]" : "text-[#1e7e48]",
      badge: currentScenario.identitySearch.matchFound ? "✕ ADVERSE HIT" : "✓ NO MATCH",
      badgeType: currentScenario.identitySearch.matchFound ? "highRisk" : "verified",
      detail: currentScenario.identitySearch.notes
    }
  ];

  const breakdown = currentScenario.riskBreakdown || [
    { name: "Document Tampering", value: isHighRisk ? 35 : (isSuspicious ? 25 : 5) },
    { name: "Face Verification", value: currentScenario.biometrics.faceMatch < 80 ? 35 : 0 },
    { name: "MRZ Validation", value: 0 },
    { name: "Expiry", value: 0 },
    { name: "Watchlist", value: currentScenario.identitySearch.matchFound ? 20 : 0 }
  ];

  const explanationPoints = currentScenario.aiExplanationPoints || [
    "✓ MRZ checksum is valid (Modulo-10 verification passed)",
    `✓ Document is not expired (Valid through ${currentScenario.person.expiryDate})`,
    `✓ Facial similarity is high (${currentScenario.biometrics.faceMatch}% match)`,
    "✓ No significant tampering or ELA compression anomalies detected",
    "✓ No adverse watchlist match found in intelligence registry"
  ];

  return (
    <div className="space-y-6">
      {/* Header with ID & Outcome */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">SENTINEL AI</span>
            <span className="text-[11px] font-mono bg-[#edf4fb] text-[#1a56a4] font-bold px-2 py-0.5 rounded border border-[#1a56a4]/20">
              ID: {screeningId}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">SCREENING RESULT</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Multi-modal autonomous forensic evaluation summary and explainable risk scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-sans font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>[ DOWNLOAD SCREENING REPORT ]</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Overall Risk & Recommendation */}
      <div
        className={`p-6 rounded-2xl border-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-center ${
          isHighRisk
            ? "bg-[#fdf0ee] border-[#b3261e]"
            : isSuspicious
            ? "bg-[#fdf8eb] border-[#b4690e]"
            : "bg-[#eef7f2] border-[#1e7e48]"
        }`}
      >
        {/* Risk Score */}
        <div className="text-center md:text-left space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98] block">
            Overall Risk
          </span>
          <div className="text-4xl font-serif font-bold text-[#0B1F51]">
            {risk} <span className="text-lg font-mono text-[#627d98]">/ 100</span>
          </div>
          <div className="inline-block pt-1">
            {isHighRisk ? (
              <span className="px-3 py-1 rounded-full bg-[#fce8e6] text-[#b3261e] font-mono text-xs font-bold border border-[#b3261e]/40">
                🔴 HIGH RISK
              </span>
            ) : isSuspicious ? (
              <span className="px-3 py-1 rounded-full bg-[#faeed0] text-[#b4690e] font-mono text-xs font-bold border border-[#b4690e]/40">
                🟡 MANUAL REVIEW
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#dcf2e3] text-[#1e7e48] font-mono text-xs font-bold border border-[#1e7e48]/40">
                🟢 LOW RISK
              </span>
            )}
          </div>
        </div>

        {/* Official Recommendation */}
        <div className="md:col-span-2 space-y-1 bg-white/70 p-4 rounded-xl border border-black/5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#627d98] block">
            Recommendation
          </span>
          <h3
            className={`font-serif text-xl font-bold ${
              isHighRisk ? "text-[#b3261e]" : isSuspicious ? "text-[#b4690e]" : "text-[#1e7e48]"
            }`}
          >
            {currentScenario.recommendedAction || (isHighRisk ? "ESCALATE TO AUTHORIZED OFFICER" : isSuspicious ? "OFFICER VERIFICATION REQUIRED" : "CLEARED / LOW RISK")}
          </h3>
          <p className="text-xs text-[#486581] font-sans leading-relaxed">
            {isHighRisk
              ? "Multiple anomalies detected. System policy dictates physical passport withholding and secondary biometric isolation."
              : isSuspicious
              ? "Potential anomalies detected in document forensics or validity period. Officer physical document review required."
              : "All identity vectors, checksums, and biometric matches validated successfully. Proceed with standard clearance."}
          </p>
        </div>
      </div>

      {/* Main Grid: Individual Checks + Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Individual Checks Table */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-mono uppercase font-bold text-[#627d98] block">
            Individual Verification Checks:
          </span>

          <div className="bg-white border border-[#d9e2ec] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#f0f4f8] border-b border-[#d9e2ec] text-[#486581] uppercase text-[10px]">
                <tr>
                  <th className="p-3">Check Sub-system</th>
                  <th className="p-3">Findings</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f8]">
                {checksList.map((chk, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafc]">
                    <td className="p-3 font-bold text-[#0B1F51]">{chk.label}</td>
                    <td className="p-3 text-[#486581] text-[11px] font-sans">{chk.detail}</td>
                    <td className="p-3 text-right">
                      <Badge variant={chk.badgeType}>{chk.badge}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 cols: RISK BREAKDOWN */}
        <div className="lg:col-span-5 bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-[#0B1F51] block">
              RISK BREAKDOWN
            </span>
            <p className="text-[11px] font-sans text-[#627d98]">
              Mathematical weighted score composition (0–100)
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs pt-1">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafc] border border-[#f0f4f8]">
                <span className="text-[#486581] font-semibold">{item.name}</span>
                <span
                  className={`font-bold ${
                    item.value > 15
                      ? "text-[#b3261e]"
                      : item.value > 0
                      ? "text-[#b4690e]"
                      : "text-[#1e7e48]"
                  }`}
                >
                  +{item.value}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t-2 border-[#0B1F51] flex items-center justify-between font-bold text-sm">
              <span className="text-[#0B1F51]">Overall Risk</span>
              <span className="text-[#0B1F51] font-serif text-base">{risk} / 100</span>
            </div>
          </div>

          <div className="p-3 bg-[#edf4fb] border border-[#1a56a4]/20 rounded-lg text-[11px] font-mono text-[#0f3566]">
            <span>ENGINE: MULTI-FACTOR WEIGHTED ENSEMBLE</span>
          </div>
        </div>
      </div>

      {/* Expandable Section: "Why did SENTINEL give this result?" */}
      <div className="bg-white border border-[#d9e2ec] rounded-2xl p-6 shadow-sm space-y-4">
        <button
          onClick={() => setExplanationOpen(!explanationOpen)}
          className="w-full flex items-center justify-between text-left font-serif text-lg font-bold text-[#0B1F51] hover:text-[#1a56a4] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1a56a4]" />
            <span>Why did SENTINEL give this result?</span>
          </div>
          {explanationOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {explanationOpen && (
          <div className="space-y-3 pt-2 border-t border-[#f0f4f8] text-xs font-sans animate-in fade-in duration-200">
            <div className="font-mono text-xs font-bold text-[#0B1F51] uppercase">AI ANALYSIS FINDINGS:</div>
            
            <ul className="space-y-1.5 font-mono text-xs">
              {explanationPoints.map((pt, i) => (
                <li
                  key={i}
                  className={`p-2 rounded-lg ${
                    pt.startsWith("✕")
                      ? "bg-[#fdf0ee] text-[#b3261e] font-semibold"
                      : pt.startsWith("⚠")
                      ? "bg-[#fdf8eb] text-[#b4690e] font-semibold"
                      : "bg-[#eef7f2] text-[#1e7e48]"
                  }`}
                >
                  {pt}
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#d9e2ec] text-xs font-sans space-y-1">
              <strong className="text-[#0B1F51] font-mono uppercase text-[11px] block">Overall Assessment:</strong>
              <p className="text-[#486581] leading-relaxed">{currentScenario.aiSummary}</p>
            </div>
          </div>
        )}
      </div>

      {/* Decision Support Legal Notice */}
      <div className="p-3 bg-[#f8fafc] border border-[#cbd7e6] rounded-xl text-[11px] font-mono text-[#627d98] flex items-center gap-2">
        <Info className="w-4 h-4 text-[#1a56a4] flex-shrink-0" />
        <span>
          <strong>DECISION-SUPPORT NOTICE:</strong> SENTINEL AI is an automated screening assistant. Final border clearance, withholding, or enforcement decisions remain with authorized border officials.
        </span>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={prevStep}
          className="px-4 py-2.5 rounded-lg bg-white border border-[#d9e2ec] hover:bg-[#f4f7fb] text-[#102a43] text-xs font-semibold font-sans transition-all cursor-pointer"
        >
          ← Back to Face Verification
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setManualReviewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#fdf8eb] hover:bg-[#faeed0] border border-[#b4690e]/40 text-[#b4690e] text-xs font-semibold font-sans transition-all cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>Flag Case</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-semibold font-sans transition-all shadow-md cursor-pointer"
          >
            <span>View Complete Final Dossier →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Step6FinalResult = () => {
  const {
    currentScenario,
    startNewScreening,
    setReportModalOpen,
    setManualReviewModalOpen,
    setActiveTab
  } = useScreening();
  const { user } = useAuth();

  const person = currentScenario.person;
  const risk = currentScenario.riskScore;
  const isFaceMismatch = Boolean(currentScenario.biometrics && currentScenario.biometrics.faceMatch < 80);
  const isHighRisk = risk >= 66 || isFaceMismatch;
  const isSuspicious = !isHighRisk && risk >= 26;
  const screeningId = currentScenario.screeningId || "SEN-2026-000184";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Official Disposition Banner */}
      <div
        className={`p-6 md:p-8 rounded-2xl border-2 text-center ${
          isHighRisk
            ? "bg-[#fdf0ee] border-[#b3261e]"
            : isSuspicious
            ? "bg-[#fdf8eb] border-[#b4690e]"
            : "bg-[#eef7f2] border-[#1e7e48]"
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">
            Final Screening Disposition
          </span>
          <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded font-bold border border-black/10 text-[#0B1F51]">
            ID: {screeningId}
          </span>
        </div>

        <h1
          className={`font-serif text-3xl md:text-4xl font-bold tracking-tight ${
            isHighRisk ? "text-[#b3261e]" : isSuspicious ? "text-[#b4690e]" : "text-[#1e7e48]"
          }`}
        >
          {isHighRisk
            ? "🔴 High Risk — Escalate to Authorized Officer"
            : isSuspicious
            ? "🟡 Manual Review — Officer Verification Required"
            : "🟢 Low Risk — Cleared for Border Entry"}
        </h1>

        <p className="text-sm text-[#486581] mt-2 max-w-xl mx-auto font-sans leading-relaxed">
          {isHighRisk
            ? "Multiple high-severity anomalies detected. System policy dictates physical passport withholding and secondary biometric isolation."
            : isSuspicious
            ? "Minor data discrepancies or document noise detected. Officer physical document review recommended before gate pass."
            : "All identity vectors, cryptographic hashes, and biometric matches validated successfully. Proceed with standard clearance."}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#102a43] pt-4 border-t border-black/10">
          <div>
            <span className="text-[#627d98]">Risk Score: </span>
            <span className="font-serif font-bold text-base text-[#0B1F51]">{risk} / 100</span>
          </div>
          <div>
            <span className="text-[#627d98]">Traveler: </span>
            <span className="font-bold">{person.name}</span>
          </div>
          <div>
            <span className="text-[#627d98]">Document ID: </span>
            <span className="font-bold text-[#0B1F51]">{person.docId}</span>
          </div>
          <div>
            <span className="text-[#627d98]">Biometric Match: </span>
            <span className="font-bold">{currentScenario.biometrics.faceMatch}%</span>
          </div>
        </div>
      </div>

      {/* 4 Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-[#627d98]">1. Document</span>
          <div className="flex justify-between items-center font-bold text-sm text-[#0B1F51]">
            <span>{person.docType.split(" ")[0]}</span>
            {currentScenario.ocr.tamperingDetected ? <Badge variant="suspicious">⚠ Suspicious</Badge> : <Badge variant="verified">✓ Valid</Badge>}
          </div>
          <p className="text-[11px] text-[#627d98] font-sans">
            {currentScenario.ocr.tamperingDetected ? "DOB field alteration detected" : "All security threads intact"}
          </p>
        </div>

        <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-[#627d98]">2. Biometric Face</span>
          <div className="flex justify-between items-center font-bold text-sm text-[#0B1F51]">
            <span>{currentScenario.biometrics.faceMatch}%</span>
            {currentScenario.biometrics.faceMatch < 80 ? <Badge variant="highRisk">✕ Mismatch</Badge> : <Badge variant="verified">✓ Matched</Badge>}
          </div>
          <p className="text-[11px] text-[#627d98] font-sans">
            {currentScenario.biometrics.faceMatch < 80 ? "Subject differs from photo" : "Facial landmarks verified"}
          </p>
        </div>

        <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-[#627d98]">3. Watchlist</span>
          <div className="flex justify-between items-center font-bold text-sm text-[#0B1F51]">
            <span>Registry</span>
            {currentScenario.identitySearch.status === "CLEARED" ? <Badge variant="verified">✓ Cleared</Badge> : <Badge variant="highRisk">✕ Flag Hit</Badge>}
          </div>
          <p className="text-[11px] text-[#627d98] font-sans">
            {currentScenario.identitySearch.status === "CLEARED" ? "Zero alias flags" : "Watchlist record match"}
          </p>
        </div>

        <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-[#627d98]">4. Audit Digest</span>
          <div className="flex justify-between items-center font-bold text-sm text-[#0B1F51]">
            <span>SHA-256</span>
            <Badge variant="verified">✓ Recorded</Badge>
          </div>
          <p className="text-[11px] text-[#627d98] font-sans">
            Cryptographic SHA-256 hash chain verified
          </p>
        </div>
      </div>

      {/* Official Receipt Box */}
      <div className="bg-[#f8fafc] border-2 border-dashed border-[#cbd7e6] rounded-xl p-5 font-mono text-xs space-y-2">
        <div className="flex justify-between font-bold text-[#0B1F51]">
          <span>SCREENING TRANSACTION RECEIPT</span>
          <span>{screeningId}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[#486581] pt-2 border-t border-[#d9e2ec]">
          <div>Station: <span className="font-bold text-[#102a43]">Delhi T3 Gate 04</span></div>
          <div>Officer: <span className="font-bold text-[#102a43]">{user?.officerId || "IND-DEL-4092"}</span></div>
          <div>Protocol: <span className="font-bold text-[#102a43]">{currentScenario.recommendedAction}</span></div>
          <div>Timestamp: <span className="font-bold text-[#102a43]">{new Date().toLocaleString()}</span></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setManualReviewModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#fdf0ee] hover:bg-[#fae1dd] border border-[#b3261e]/40 text-[#b3261e] text-xs font-semibold font-sans transition-all cursor-pointer"
          >
            Flag Case for Supervisor
          </button>

          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-semibold font-sans transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Screening Report</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="px-4 py-2 rounded-lg bg-white border border-[#d9e2ec] hover:bg-[#f4f7fb] text-[#102a43] text-xs font-semibold font-sans transition-all cursor-pointer"
          >
            Return to Dashboard
          </button>

          <button
            onClick={() => startNewScreening()}
            className="px-6 py-2 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-semibold font-sans transition-all shadow-md cursor-pointer"
          >
            Start New Screening →
          </button>
        </div>
      </div>
    </div>
  );
};