import React, { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Eye, Sparkles, Lock, Award } from "lucide-react";

export const DocumentCanvasOverlay = ({ scenario, isScanning = false, interactive = true }) => {
  const [activeInspector, setActiveInspector] = useState(null);
  const person = scenario.person;
  const isTampered = scenario.ocr.tamperingDetected;

  return (
    <div className="relative bg-[#060c17] border-2 border-slate-700/80 rounded-xl p-4 md:p-6 shadow-2xl overflow-hidden font-sans select-none">
      {/* Official Government Synthetic Disclaimer Notice */}
      <div className="bg-amber-950/90 border border-amber-500/50 rounded px-3 py-1.5 mb-4 text-center">
        <span className="text-[11px] font-mono font-bold tracking-wider text-amber-300 uppercase flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          SAMPLE / DEMO DOCUMENT — NOT A REAL PASSPORT — FOR SIH EVALUATION ONLY
        </span>
      </div>

      {/* Laser Scanner Bar Animation */}
      {isScanning && (
        <div className="absolute inset-x-0 z-30 pointer-events-none animate-scan-laser h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b]">
          <div className="w-full flex justify-between px-4 text-[9px] font-mono text-amber-300 font-bold -mt-3.5">
            <span>[OPTICAL FORENSIC SCANNER ACTIVE]</span>
            <span>FREQ: 850nm UV/IR SPEC</span>
          </div>
        </div>
      )}

      {/* Document Sheet Card with Official Border Look */}
      <div className="relative bg-gradient-to-br from-[#0c182c] via-[#10203a] to-[#0c182c] border-2 border-amber-500/40 rounded-lg p-4 md:p-5 shadow-inner">
        {/* Holographic Security Overlay Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-dots-pattern"></div>
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-500/10 blur-xl pointer-events-none"></div>

        {/* Passport / Visa Official Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#162d4e] border border-amber-400/60 flex items-center justify-center text-amber-300 text-lg font-bold shadow-sm">
              🏛️
            </div>
            <div>
              <div className="text-xs font-mono font-extrabold tracking-widest uppercase text-amber-300">
                भारत गणराज्य | REPUBLIC OF INDIA
              </div>
              <div className="text-[10px] font-mono text-slate-300">
                {person.docType.toUpperCase()} • CODE: {person.nationality.substring(0, 3)}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono font-bold text-amber-400">{person.docId}</div>
            <div className="text-[10px] font-mono text-slate-400">CHIP ID: SEC-9941</div>
          </div>
        </div>

        {/* Document Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Photo Frame with Seal Stamp */}
          {(() => {
            const isPhotoTampered = Boolean(
              scenario.signals?.some(s => s.name.includes("Photo") && s.status !== "PASS") ||
              scenario.ocr?.tamperingDetails?.toLowerCase().includes("photo") ||
              scenario.ocr?.tamperingDetails?.toLowerCase().includes("splice")
            );
            return (
              <div className="md:col-span-4 flex flex-col items-center">
                <div className={`relative w-28 h-36 rounded border-2 overflow-hidden bg-slate-950 shadow-md ${
                  isPhotoTampered ? "border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse" : "border-amber-400/60"
                }`}>
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-full h-full object-cover grayscale contrast-125 brightness-90"
                  />
                  {/* Photo Security Grid */}
                  <div className="absolute inset-0 border border-amber-400/30 grid grid-cols-3 grid-rows-3 pointer-events-none"></div>
                  {isPhotoTampered ? (
                    <div className="absolute top-1 left-1 px-1 rounded bg-rose-600 text-[8px] font-mono text-white font-bold border border-rose-300">
                      PHOTO SEAM ALERT
                    </div>
                  ) : (
                    <div className="absolute bottom-1 right-1 px-1 rounded bg-[#0b172a] text-[8px] font-mono text-amber-300 font-bold border border-amber-500/40">
                      ICAO 9303
                    </div>
                  )}
                </div>
                <span className={`mt-2 text-[10px] font-mono uppercase tracking-wider font-semibold ${
                  isPhotoTampered ? "text-rose-400 font-bold" : "text-slate-300"
                }`}>
                  {isPhotoTampered ? "⚠️ Photo Splice Suspected" : "Enrolled Biometric Photo"}
                </span>
              </div>
            );
          })()}

          {/* Right: Data Fields */}
          <div className="md:col-span-8 grid grid-cols-2 gap-2.5 text-xs font-mono">
            {/* Field 1: Name */}
            <div className="col-span-2 p-1.5 rounded bg-[#070e1b] border border-slate-700">
              <span className="text-[9px] uppercase text-slate-400 block font-semibold">Full Name / पूरा नाम</span>
              <span className="font-bold text-slate-100">{person.name.toUpperCase()}</span>
            </div>

            {/* Field 2: Nationality */}
            <div className="p-1.5 rounded bg-[#070e1b] border border-slate-700">
              <span className="text-[9px] uppercase text-slate-400 block font-semibold">Nationality / राष्ट्रीयता</span>
              <span className="font-semibold text-slate-200">{person.nationality}</span>
            </div>

            {/* Field 3: Gender */}
            <div className="p-1.5 rounded bg-[#070e1b] border border-slate-700">
              <span className="text-[9px] uppercase text-slate-400 block font-semibold">Sex / लिंग</span>
              <span className="font-semibold text-slate-200">{person.gender}</span>
            </div>

            {/* Field 4: Date of Birth */}
            {(() => {
              const isDobTampered = Boolean(
                isTampered && (
                  person.originalDob ||
                  scenario.ocr?.highlightBox?.field?.toLowerCase().includes("dob") ||
                  scenario.ocr?.highlightBox?.field?.toLowerCase().includes("birth") ||
                  scenario.ocr?.tamperingDetails?.toLowerCase().includes("birth") ||
                  scenario.ocr?.tamperingDetails?.toLowerCase().includes("dob") ||
                  scenario.signals?.some(s => (s.name.includes("DOB") || s.name.includes("Birth")) && s.status !== "PASS")
                )
              );
              return (
                <div
                  className={`p-1.5 rounded transition-all relative ${
                    isDobTampered
                      ? "bg-rose-950/80 border-2 border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse"
                      : "bg-[#070e1b] border border-slate-700"
                  }`}
                  onMouseEnter={() => isDobTampered && setActiveInspector("dob")}
                  onMouseLeave={() => setActiveInspector(null)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase text-slate-400 block font-semibold">DOB / जन्म तिथि</span>
                    {isDobTampered && (
                      <span className="text-[8px] font-bold px-1 rounded bg-rose-600 text-white">
                        ALTERED
                      </span>
                    )}
                  </div>
                  <span className={`font-bold ${isDobTampered ? "text-rose-300 text-sm underline decoration-rose-500" : "text-slate-200"}`}>
                    {person.dob}
                  </span>

                  {/* Tamper Anomaly Tooltip */}
                  {isDobTampered && (
                    <div className="mt-1 p-1.5 rounded bg-rose-900/90 border border-rose-400 text-[10px] text-rose-100 font-sans leading-tight">
                      <div className="font-bold flex items-center gap-1 text-rose-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>DATA INCONSISTENCY DETECTED</span>
                      </div>
                      {person.originalDob && (
                        <div className="mt-0.5">
                          Central Registry: <span className="font-mono font-bold text-emerald-300">{person.originalDob}</span>
                        </div>
                      )}
                      <div>
                        Physical Scanned: <span className="font-mono font-bold text-rose-300">{person.dob}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Field 5: Expiry Date */}
            {(() => {
              const isExpired = Boolean(
                scenario.signals?.some(s => s.name.includes("Expiry") && s.status === "FAILED")
              );
              return (
                <div className={`p-1.5 rounded transition-all relative ${
                  isExpired ? "bg-rose-950/80 border-2 border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-[#070e1b] border border-slate-700"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase text-slate-400 block font-semibold">Expiry Date / समाप्ति तिथि</span>
                    {isExpired && (
                      <span className="text-[8px] font-bold px-1 rounded bg-rose-600 text-white">
                        EXPIRED
                      </span>
                    )}
                  </div>
                  <span className={`font-semibold ${isExpired ? "text-rose-300 font-bold" : "text-slate-200"}`}>{person.expiryDate}</span>
                </div>
              );
            })()}

            {/* Field 6: Issuing Authority */}
            <div className="col-span-2 p-1.5 rounded bg-[#070e1b] border border-slate-700">
              <span className="text-[9px] uppercase text-slate-400 block font-semibold">Issuing Authority / जारीकर्ता प्राधिकरण</span>
              <span className="text-slate-200 text-[11px]">{person.issuingAuthority}</span>
            </div>
          </div>
        </div>

        {/* Machine Readable Zone (MRZ) */}
        {(() => {
          const isMrzTampered = Boolean(
            scenario.signals?.some(s => s.name.includes("MRZ") && s.status === "FAILED") ||
            scenario.ocr?.highlightBox?.field?.toLowerCase().includes("mrz")
          );
          return (
            <div className={`mt-4 pt-3 border-t rounded p-2.5 font-mono text-[11px] md:text-xs tracking-widest leading-relaxed transition-all ${
              isMrzTampered 
                ? "bg-rose-950/70 border-2 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                : "bg-[#050b14] border border-slate-700 text-amber-300/90"
            }`}>
              <div className="flex items-center justify-between text-[9px] uppercase mb-1 font-sans">
                <span className={isMrzTampered ? "text-rose-400 font-bold" : "text-slate-400"}>
                  Machine Readable Zone (ICAO DOC 9303 MRZ-TD3):
                </span>
                {isMrzTampered && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[9px]">
                    ✕ MODULO-10 CHECKSUM FAILED
                  </span>
                )}
              </div>
              <div className="truncate">{person.mrzLine1}</div>
              <div className="truncate">{person.mrzLine2}</div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};