import React, { useState } from "react";
import { useScreening } from "../context/ScreeningContext";
import {
  Link2,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  Clock,
  Database,
  Search,
  ArrowRight,
  Filter,
  Eye,
  Check,
  Sparkles
} from "lucide-react";
import { Badge } from "../components/common/Badge";

export const BlockchainAuditView = () => {
  const { currentScenario, selectedScenarioId, setScenario, startNewScreening } = useScreening();
  const [activeTab, setActiveTab] = useState("failed");

  const failedExample = {
    docId: "DEMO-28470",
    name: "Arjun Mehta",
    docType: "Standard Passport",
    originalHash: "8f3a9c7b508912de7a61d02334fca89812903e48bb912384a",
    currentHash: "2d7b91a4773829ab10c3f59220914e910283c74991823901b",
    integrity: "FAILED",
    txId: "DEMO-TX-88291-MUM",
    timestamp: "31 Aug 2026, 21:15:42 IST",
    blockNumber: "#8,420,119",
    reason: "SHA-256 digest divergence detected due to visual DOB modification (15/08/1995 vs 15/08/2002).",
    scenarioId: "scenarioB"
  };

  const verifiedExample = {
    docId: "DEMO-28471",
    name: "Rahul Sharma",
    docType: "Standard Passport",
    originalHash: "8f3a9c7b21e05d9841f30129bc82e1719a820c897f25bb02e9",
    currentHash: "8f3a9c7b21e05d9841f30129bc82e1719a820c897f25bb02e9",
    integrity: "VERIFIED",
    txId: "DEMO-TX-440192-IND",
    timestamp: "31 Aug 2026, 21:30:15 IST",
    blockNumber: "#8,421,902",
    reason: "Cryptographic hash matches enrolled genesis record exactly with zero byte variance.",
    scenarioId: "scenarioA"
  };

  const activeRecord = activeTab === "failed" ? failedExample : verifiedExample;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Cryptographic Audit</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">Document Integrity Ledger</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Cryptographic SHA-256 digests provide an immutable, tamper-evident record for all enrolled travel credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#f4f7fb] p-1.5 rounded-lg border border-[#d9e2ec] font-mono text-xs">
          <button
            onClick={() => setActiveTab("failed")}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeTab === "failed"
                ? "bg-[#b3261e] text-white shadow-sm"
                : "text-[#486581] hover:text-[#0B1F51]"
            }`}
          >
            ❌ Altered Example (Scenario B)
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeTab === "verified"
                ? "bg-[#1e7e48] text-white shadow-sm"
                : "text-[#486581] hover:text-[#0B1F51]"
            }`}
          >
            ✓ Verified Example (Scenario A)
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-[#edf4fb] border-l-4 border-[#1a56a4] p-4 rounded-r-xl text-xs text-[#0f3566] font-sans leading-relaxed">
        <strong>Tamper-Evident Ledger Architecture:</strong> The ledger stores non-PII cryptographic fingerprint hashes generated at the time of official credential enrollment. When scanned at a border gate, the optical digest is compared against the immutable on-chain record to mathematically detect tampering.
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hash Comparison Box */}
        <div className="lg:col-span-7 bg-white border border-[#d9e2ec] rounded-xl p-6 shadow-sm space-y-5 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#f0f4f8] pb-3">
            <span className="text-[#627d98] uppercase font-bold text-[11px]">Ledger Query Response:</span>
            {activeRecord.integrity === "VERIFIED" ? (
              <Badge variant="verified" size="lg">✓ INTEGRITY VERIFIED</Badge>
            ) : (
              <Badge variant="highRisk" size="lg">❌ INTEGRITY FAILED</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-[#627d98] uppercase block">Document ID:</span>
              <span className="font-bold text-[#0B1F51] text-sm">{activeRecord.docId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#627d98] uppercase block">Traveler:</span>
              <span className="font-semibold text-[#102a43]">{activeRecord.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#627d98] uppercase block">Block Number:</span>
              <span className="text-[#0B1F51] font-bold">{activeRecord.blockNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#627d98] uppercase block">Timestamp:</span>
              <span className="text-[#486581]">{activeRecord.timestamp}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#d9e2ec] space-y-1">
              <span className="text-[10px] text-[#1e7e48] uppercase font-bold block">
                Original Enrolled SHA-256 Hash (Genesis):
              </span>
              <div className="text-[#102a43] text-[11px] break-all bg-white p-2 rounded border border-[#d9e2ec]">
                {activeRecord.originalHash}
              </div>
            </div>

            <div
              className={`p-3 rounded-lg border space-y-1 ${
                activeRecord.integrity === "VERIFIED" ? "bg-[#eef7f2] border-[#1e7e48]/30" : "bg-[#fdf0ee] border-[#b3261e]/40"
              }`}
            >
              <span
                className={`text-[10px] uppercase font-bold block ${
                  activeRecord.integrity === "VERIFIED" ? "text-[#1e7e48]" : "text-[#b3261e]"
                }`}
              >
                Current Scanned Optical Hash:
              </span>
              <div
                className={`text-[11px] break-all p-2 rounded border ${
                  activeRecord.integrity === "VERIFIED"
                    ? "bg-white text-[#1e7e48] border-[#1e7e48]/30"
                    : "bg-white text-[#b3261e] border-[#b3261e]/30"
                }`}
              >
                {activeRecord.currentHash}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#d9e2ec] text-[11px] font-sans text-[#486581] leading-relaxed">
            <strong>Audit Finding: </strong> {activeRecord.reason}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setScenario(activeRecord.scenarioId);
                startNewScreening(activeRecord.scenarioId);
              }}
              className="px-5 py-2 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white font-sans font-bold text-xs transition-all shadow-sm"
            >
              Load Full Screening Wizard for this Case →
            </button>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="lg:col-span-5 bg-white border border-[#d9e2ec] rounded-xl p-6 shadow-sm space-y-4 font-mono text-xs">
          <span className="text-[#627d98] uppercase font-bold text-[11px] block border-b border-[#f0f4f8] pb-3">
            Verification Lifecycle Timeline:
          </span>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e4ebf5] pl-8">
            <div className="relative">
              <div className="absolute -left-8 top-0.5 w-4 h-4 rounded-full bg-[#0B1F51] border-2 border-white"></div>
              <div className="font-bold text-[#0B1F51]">1. Document Registered & Enrolled</div>
              <div className="text-[11px] text-[#486581] font-sans">Passport Office issuance authority signed payload.</div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-0.5 w-4 h-4 rounded-full bg-[#0B1F51] border-2 border-white"></div>
              <div className="font-bold text-[#0B1F51]">2. SHA-256 Hash Generated</div>
              <div className="text-[11px] text-[#486581] font-sans">Cryptographic fingerprint anchored to distributed ledger.</div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-0.5 w-4 h-4 rounded-full bg-[#0B1F51] border-2 border-white"></div>
              <div className="font-bold text-[#0B1F51]">3. Border Verification Ingested</div>
              <div className="text-[11px] text-[#486581] font-sans">Optical scanner ingested physical credential at Gate 04.</div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-0.5 w-4 h-4 rounded-full bg-[#0B1F51] border-2 border-white"></div>
              <div className="font-bold text-[#0B1F51]">4. Live Hash Compared On-Chain</div>
              <div className="text-[11px] text-[#486581] font-sans">Validation executed in 12ms with zero-knowledge proof.</div>
            </div>

            <div className="relative">
              <div
                className={`absolute -left-8 top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                  activeRecord.integrity === "VERIFIED" ? "bg-[#1e7e48]" : "bg-[#b3261e]"
                }`}
              ></div>
              <div className={`font-bold ${activeRecord.integrity === "VERIFIED" ? "text-[#1e7e48]" : "text-[#b3261e]"}`}>
                5. {activeRecord.integrity === "VERIFIED" ? "Integrity Confirmed (Match)" : "Integrity Failure Triggered"}
              </div>
              <div className="text-[11px] text-[#486581] font-sans">
                {activeRecord.integrity === "VERIFIED" ? "Clearance token signed." : "Security alert broadcast to officer."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertsView = () => {
  const { alerts, resolveAlert, setScenario, startNewScreening } = useScreening();
  const [filter, setFilter] = useState("ALL");

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "ALL") return true;
    return a.category.toUpperCase() === filter || a.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Security Management</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">Security Alert Operations Center</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Active checkpoint threat notifications, biometric divergence warnings, and ledger integrity violations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-[#f4f7fb] p-1.5 rounded-lg border border-[#d9e2ec] font-mono text-xs">
          {["ALL", "CRITICAL", "HIGH RISK", "SUSPICIOUS", "RESOLVED"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                filter === cat
                  ? "bg-[#0B1F51] text-white shadow-sm font-bold"
                  : "text-[#486581] hover:text-[#0B1F51]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === "CRITICAL";
          const isHigh = alert.severity === "HIGH";
          const isResolved = alert.status === "RESOLVED";

          return (
            <div
              key={alert.id}
              className={`bg-white border rounded-xl p-5 shadow-sm space-y-3 transition-all ${
                isResolved
                  ? "border-[#d9e2ec] opacity-80"
                  : isCrit
                  ? "border-[#b3261e] border-l-4"
                  : isHigh
                  ? "border-[#b3261e]/60"
                  : "border-[#b4690e]/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0f4f8] pb-3 font-mono text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded ${
                      isResolved
                        ? "bg-[#eef7f2] text-[#1e7e48]"
                        : isCrit || isHigh
                        ? "bg-[#fdf0ee] text-[#b3261e]"
                        : "bg-[#fdf8eb] text-[#b4690e]"
                    }`}
                  >
                    {isResolved ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <span className="font-bold text-[#102a43] text-sm font-serif">{alert.title}</span>
                  <span className="text-[#627d98]">[{alert.id}]</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={isResolved ? "verified" : isCrit || isHigh ? "highRisk" : "suspicious"}>
                    {alert.severity}
                  </Badge>
                  <span className="text-[#627d98] text-[11px]">{alert.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-[#486581] font-sans leading-relaxed">{alert.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-[#f8fafc] p-3 rounded-lg border border-[#d9e2ec]">
                <div>
                  <span className="text-[10px] text-[#627d98] uppercase block">Traveler:</span>
                  <span className="font-semibold text-[#102a43]">{alert.personName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#627d98] uppercase block">Document ID:</span>
                  <span className="font-bold text-[#0B1F51]">{alert.docId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#627d98] uppercase block">Checkpoint:</span>
                  <span className="text-[#486581]">{alert.checkpoint}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-[11px] font-mono text-[#627d98]">
                  STATUS: <strong className="text-[#102a43]">{alert.actionTaken || "Awaiting Officer Review"}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {!isResolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#eef7f2] hover:bg-[#d5eedf] text-[#1e7e48] border border-[#1e7e48]/30 text-xs font-mono font-bold uppercase transition-all"
                    >
                      ✓ Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (alert.docId === "DEMO-28470") setScenario("scenarioB");
                      else if (alert.docId === "DEMO-28469") setScenario("scenarioC");
                      else setScenario("scenarioA");
                      startNewScreening();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-sans font-semibold transition-all shadow-sm"
                  >
                    Investigate Case →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};