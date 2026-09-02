import React, { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  X, 
  RefreshCw, 
  Server, 
  Database,
  Cpu,
  ShieldCheck
} from "lucide-react";

export const SystemStatusModal = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await api.checkHealth();
      setHealthData(res.data || null);
    } catch {
      setHealthData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modules = healthData?.modules_ready || {};
  const isHealthy = healthData?.status === "HEALTHY";

  const moduleList = [
    { key: "api", name: "FastAPI Gateway", status: isHealthy, desc: "REST endpoints, CORS validation, multipart upload" },
    { key: "ocr_engine", name: "OCR & MRZ Engine", status: modules.ocr_engine !== false, desc: "ICAO Doc 9303 parser & vision pattern scanner" },
    { key: "mrz_parser", name: "Modulo 10 Checksum", status: modules.mrz_parser !== false, desc: "7-3-1 weight deterministic algorithm" },
    { key: "tamper_detection_ela", name: "Forensics & ELA Engine", status: modules.tamper_detection_ela !== false, desc: "90% JPEG recompression gradient analysis" },
    { key: "face_verification", name: "Biometric 1:1 Engine", status: modules.face_verification !== false, desc: "Normalized cosine facial similarity matching" },
    { key: "risk_engine", name: "Explainable Risk Engine", status: modules.risk_engine !== false, desc: "Multi-factor weighted composite scoring" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              SENTINEL AI — System Subsystem Status
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${isHealthy ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Core AI Backend: {healthData?.status || "OFFLINE"}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Database: {healthData?.database?.type || "In-Memory Fallback"} ({healthData?.database?.connected ? "Connected" : "Disconnected"})
                </div>
              </div>
            </div>
            <button
              onClick={fetchHealth}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh Health"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
            Subsystem Health Diagnostics
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {moduleList.map((m) => {
              const active = isHealthy && m.status;
              return (
                <div
                  key={m.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <span>{m.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">[{m.key}]</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{m.desc}</p>
                  </div>
                  <div className="shrink-0">
                    {active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-mono text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        READY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 font-mono text-[11px] font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        OFFLINE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Backend URL: http://localhost:8000</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-sans transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
