import React, { useState } from "react";
import { useScreening } from "../../context/ScreeningContext";
import { useAuth } from "../../context/AuthContext";
import {
  X,
  Printer,
  Download,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Lock
} from "lucide-react";

export const ScreeningReportModal = () => {
  const { reportModalOpen, setReportModalOpen, currentScenario } = useScreening();
  const { user } = useAuth();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!reportModalOpen) return null;

  const person = currentScenario.person;
  const risk = currentScenario.riskScore;
  const isHigh = risk > 70;
  const isSuspicious = risk > 25 && risk <= 70;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#d9e2ec] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Action Bar */}
        <div className="p-4 bg-[#f8fafc] border-b border-[#d9e2ec] flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-[#0B1F51] font-mono text-xs font-bold uppercase">
            <FileCheck className="w-4 h-4" />
            <span>Official Border Screening Incident & Verification Dossier</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-sans font-bold transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#f0f4f8] border border-[#d9e2ec] text-[#102a43] text-xs font-sans font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? "Saved PDF" : "Download PDF"}</span>
            </button>

            <button
              onClick={() => setReportModalOpen(false)}
              className="p-1.5 rounded-lg text-[#627d98] hover:text-[#102a43] hover:bg-[#e4ebf5] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Dossier Sheet */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 font-sans text-[#102a43] bg-white">
          {/* Header */}
          <div className="border-b-2 border-[#0B1F51] pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-12 h-12 flex-shrink-0" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#0B1F51" strokeWidth="2"/>
                <circle cx="20" cy="20" r="3" fill="#0B1F51"/>
                <g stroke="#0B1F51" strokeWidth="1">
                  <line x1="20" y1="2" x2="20" y2="38"/>
                  <line x1="2" y1="20" x2="38" y2="20"/>
                  <line x1="6.2" y1="6.2" x2="33.8" y2="33.8"/>
                  <line x1="6.2" y1="33.8" x2="33.8" y2="6.2"/>
                </g>
              </svg>
              <div>
                <h1 className="text-xl font-bold font-serif text-[#0B1F51]">IDShield AI · IMMIGRATION DOSSIER</h1>
                <p className="text-[11px] font-mono text-[#627d98] uppercase tracking-wider">
                  BUREAU OF IMMIGRATION · MINISTRY OF HOME AFFAIRS (DEMO)
                </p>
                <p className="text-[10px] text-[#b3261e] font-mono font-bold">
                  CLASSIFICATION: RESTRICTED // IMMIGRATION ACTIONABLE ONLY
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-[#486581]">
              <div className="font-bold text-[#0B1F51]">DOSSIER: DOS-2026-DEL-{person.docId}</div>
              <div>STATION: DELHI IGI T3 // GATE 04</div>
              <div>DATE: 31-AUG-2026 22:33 IST</div>
            </div>
          </div>

          {/* Disposition Stamp */}
          <div
            className={`p-4 rounded-xl border-2 flex items-center justify-between ${
              isHigh ? "bg-[#fdf0ee] border-[#b3261e] text-[#b3261e]" : isSuspicious ? "bg-[#fdf8eb] border-[#b4690e] text-[#b4690e]" : "bg-[#eef7f2] border-[#1e7e48] text-[#1e7e48]"
            }`}
          >
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                SCREENING DISPOSITION RESULT:
              </span>
              <span className="text-xl font-bold font-serif">
                {isHigh ? "CRITICAL HIGH RISK — HOLD & INSPECTION" : isSuspicious ? "SUSPICIOUS — SECONDARY AUDIT" : "LOW RISK — VERIFIED CLEARANCE"}
              </span>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] uppercase block">Composite Score</span>
              <span className="text-2xl font-serif font-bold">{risk} / 100</span>
            </div>
          </div>

          {/* Traveler Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#f8fafc] p-5 rounded-xl border border-[#d9e2ec]">
            <div className="md:col-span-3 flex flex-col items-center">
              <div className="w-28 h-36 rounded border-2 border-[#d9e2ec] overflow-hidden bg-slate-950">
                <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover grayscale" />
              </div>
              <span className="text-[10px] font-mono text-[#627d98] mt-2">DOC PORTRAIT</span>
            </div>

            <div className="md:col-span-9 grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#627d98] uppercase block">Full Name:</span>
                <span className="font-bold text-[#102a43] text-sm">{person.name}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#627d98] uppercase block">Document ID:</span>
                <span className="font-bold text-[#0B1F51]">{person.docId}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#627d98] uppercase block">Document Type:</span>
                <span className="text-[#102a43]">{person.docType}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#627d98] uppercase block">Nationality:</span>
                <span className="text-[#102a43]">{person.nationality}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#627d98] uppercase block">Date of Birth:</span>
                <span className={currentScenario.ocr.tamperingDetected ? "text-[#b3261e] font-bold" : "text-[#102a43]"}>
                  {person.dob} {currentScenario.ocr.tamperingDetected && "(Enrolled: 15/08/2002)"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#627d98] uppercase block">Expiry Date:</span>
                <span className="text-[#102a43]">{person.expiryDate}</span>
              </div>
            </div>
          </div>

          {/* Sub-system Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#627d98]">
              Sub-System Findings & Attestation:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#d9e2ec]">
                <div className="flex justify-between font-bold">
                  <span>OCR Confidence:</span>
                  <span className="text-[#1e7e48]">{currentScenario.ocr.confidence}%</span>
                </div>
                <div className="text-[11px] text-[#627d98] mt-1">MRZ line parity verified</div>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#d9e2ec]">
                <div className="flex justify-between font-bold">
                  <span>Biometric Face Match:</span>
                  <span className={currentScenario.biometrics.faceMatch >= 80 ? "text-[#1e7e48]" : "text-[#b3261e]"}>
                    {currentScenario.biometrics.faceMatch}% ({currentScenario.biometrics.status})
                  </span>
                </div>
                <div className="text-[11px] text-[#627d98] mt-1">68 facial landmarks verified</div>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#d9e2ec]">
                <div className="flex justify-between font-bold">
                  <span>Tamper Scan:</span>
                  <span className={currentScenario.ocr.tamperingDetected ? "text-[#b3261e]" : "text-[#1e7e48]"}>
                    {currentScenario.ocr.tamperingDetected ? "ALTERATION DETECTED" : "PASSED"}
                  </span>
                </div>
                <div className="text-[11px] text-[#627d98] mt-1">{currentScenario.ocr.tamperingDetails}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#d9e2ec]">
                <div className="flex justify-between font-bold">
                  <span>Blockchain Ledger:</span>
                  <span className={currentScenario.blockchain.status === "VERIFIED" ? "text-[#1e7e48]" : "text-[#b3261e]"}>
                    {currentScenario.blockchain.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#627d98] mt-1 truncate">
                  Hash: {currentScenario.blockchain.currentHash.substring(0, 16)}...
                </div>
              </div>
            </div>
          </div>

          {/* AI Decision Reasoning */}
          <div className="p-4 rounded-xl bg-[#edf4fb] border border-[#1a56a4]/30 text-xs text-[#0f3566]">
            <span className="text-[10px] font-mono uppercase font-bold text-[#0B1F51] block mb-1">
              AI Decision Summary:
            </span>
            <p className="font-sans leading-relaxed">{currentScenario.aiSummary}</p>
          </div>

          {/* Officer Sign-off */}
          <div className="pt-4 border-t border-[#d9e2ec] flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#627d98] gap-4">
            <div>
              <div>SCREENING OFFICER: {user?.officerName || "Officer Vikramaditya Sharma"}</div>
              <div>BADGE: {user?.badgeNumber || "BS-092-DEL"} // ID: {user?.officerId || "IND-DEL-4092"}</div>
              <div>HARDWARE HSM: FIPS-140-3 CERTIFIED #99410</div>
            </div>

            <div className="border border-[#0B1F51] rounded-lg p-2.5 bg-[#f0f4f8] text-center">
              <span className="text-[9px] uppercase font-bold text-[#0B1F51] block tracking-widest">
                DIGITALLY ATTESTED
              </span>
              <span className="text-[10px] text-[#102a43] font-mono">IDSHIELD-SIG-2026-9042</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};