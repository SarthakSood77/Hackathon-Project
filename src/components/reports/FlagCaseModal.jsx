import React, { useState } from "react";
import { useScreening } from "../../context/ScreeningContext";
import { X, Flag } from "lucide-react";

export const FlagCaseModal = () => {
  const { manualReviewModalOpen, setManualReviewModalOpen, flagCase, currentScenario } = useScreening();
  const [reason, setReason] = useState("Suspected Date of Birth alteration and physical tampering");
  const [priority, setPriority] = useState("HIGH");
  const [routingUnit, setRoutingUnit] = useState("Forensic Document & Biometric Isolation Unit");
  const [notes, setNotes] = useState("");

  if (!manualReviewModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    flagCase(`${priority} PRIORITY: ${reason}. Routing to: ${routingUnit}. Notes: ${notes || "None"}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#d9e2ec] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#f0f4f8] pb-3">
          <div className="flex items-center gap-2 text-[#0B1F51] font-serif text-lg font-bold">
            <Flag className="w-5 h-5 text-[#b4690e]" />
            <span>Escalate & Flag Case for Secondary Review</span>
          </div>

          <button
            onClick={() => setManualReviewModalOpen(false)}
            className="p-1 rounded text-[#627d98] hover:text-[#102a43]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          <div className="p-3 rounded-lg bg-[#fdf8eb] border border-[#b4690e]/30 text-[#6d4f04] text-[11px] leading-relaxed">
            Flagging subject <span className="font-bold text-[#102a43]">{currentScenario.person.name}</span> ({currentScenario.person.docId}) for mandatory supervisor interrogation.
          </div>

          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Primary Flag Reason:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2.5 text-[#102a43] focus:outline-none focus:border-[#0B1F51]"
            >
              <option value="Suspected Date of Birth alteration and physical tampering">
                Suspected DOB Field Tampering / Pixel Anomaly
              </option>
              <option value="Biometric Face Mismatch / Possible Impersonation">
                Biometric Face Mismatch / Identity Impersonation
              </option>
              <option value="Blockchain Cryptographic Hash Mismatch">
                Blockchain Cryptographic Hash Failure
              </option>
              <option value="Multiple Identity Match / Watchlist Cross-Link">
                Multiple Identity / Watchlist Linkage
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Priority Level:</label>
            <div className="grid grid-cols-3 gap-2">
              {["CRITICAL", "HIGH", "STANDARD"].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-2 rounded-lg border text-center font-mono font-bold text-xs transition-all ${
                    priority === p
                      ? "border-[#0B1F51] bg-[#0B1F51] text-white"
                      : "border-[#d9e2ec] bg-[#f8fafc] text-[#486581]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Routing Unit:</label>
            <input
              type="text"
              value={routingUnit}
              onChange={(e) => setRoutingUnit(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2 text-[#102a43] focus:outline-none focus:border-[#0B1F51]"
            />
          </div>

          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Officer Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter specific physical observations or interview notes..."
              rows={3}
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2 text-[#102a43] focus:outline-none focus:border-[#0B1F51]"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0f4f8]">
            <button
              type="button"
              onClick={() => setManualReviewModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white border border-[#d9e2ec] text-[#486581] font-bold uppercase transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white font-bold uppercase font-mono tracking-wider transition-all"
            >
              Confirm Flag Submission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};