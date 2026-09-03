import React from "react";
import { CheckCircle2, Loader2, Circle, ShieldCheck } from "lucide-react";

export const ScreeningProgress = ({ progress }) => {
  if (!progress || !progress.isRunning) return null;

  const stages = progress.stages || [
    "Document uploaded",
    "OCR processing",
    "MRZ verification",
    "Document tampering analysis",
    "Face verification",
    "Watchlist screening",
    "Risk calculation"
  ];

  const currentIdx = progress.currentStageIndex;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F51]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#d9e2ec] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#f0f4f8] pb-5">
          <div className="w-12 h-12 rounded-full bg-[#edf4fb] text-[#0B1F51] flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6 text-[#0B1F51] animate-pulse" />
          </div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">IDShield AI ENGINE</p>
          <h2 className="font-serif text-2xl font-bold text-[#0B1F51]">AI SCREENING IN PROGRESS</h2>
          <p className="text-xs text-[#486581] font-sans">
            Processing identity credentials through multi-factor biometric & forensic verification pipeline.
          </p>
        </div>

        {/* Progress Checklist */}
        <div className="space-y-3 font-mono text-xs">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isPending = idx > currentIdx;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#eef7f2] border-[#1e7e48]/30 text-[#1e7e48]"
                    : isCurrent
                    ? "bg-[#edf4fb] border-[#1a56a4] text-[#0B1F51] shadow-sm ring-1 ring-[#1a56a4]/20"
                    : "bg-[#f8fafc] border-[#e2e8f0] text-[#94a3b8]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#1e7e48]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#0B1F51] animate-spin" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#cbd5e1]" />
                    )}
                  </div>
                  <span className={`font-semibold ${isCurrent ? "font-bold" : ""}`}>
                    {stage}
                  </span>
                </div>

                <div className="text-[10px] uppercase font-bold">
                  {isCompleted && <span className="text-[#1e7e48]">COMPLETED</span>}
                  {isCurrent && <span className="text-[#0B1F51] animate-pulse">PROCESSING...</span>}
                  {isPending && <span className="text-[#94a3b8]">QUEUED</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] font-mono text-[#627d98]">
          <span>SUB-SECOND MULTI-MODAL INFERENCE ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
