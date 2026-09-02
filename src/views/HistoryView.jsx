import React, { useState } from "react";
import { useScreening } from "../context/ScreeningContext";
import { useAuth } from "../context/AuthContext";
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Layers,
  Settings,
  User,
  Sliders,
  Bell,
  Lock,
  FileText,
  Save,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/common/Badge";
import { MOCK_ANALYTICS } from "../data/mockAnalytics";

export const HistoryView = () => {
  const { screenings, setScenario, startNewScreening } = useScreening();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = screenings.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.docId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesType = typeFilter === "ALL" || s.docType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Audit Logs</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">Screening Audit History & Archives</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Immutable checkpoint transaction logs and biometric match records.
          </p>
        </div>

        <button
          onClick={() => alert("Audit log export generated (CSV format).")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#f4f7fb] border border-[#d9e2ec] text-[#102a43] text-xs font-semibold font-sans transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-[#0B1F51]" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#d9e2ec] rounded-xl p-4 shadow-sm space-y-3 font-sans text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#627d98]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Name, or Doc..."
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg pl-9 pr-3 py-2 text-[#102a43] focus:outline-none focus:border-[#0B1F51] font-mono"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2 text-[#102a43] focus:outline-none focus:border-[#0B1F51]"
            >
              <option value="ALL">All Statuses (Verified / Suspicious / High Risk)</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="SUSPICIOUS">Suspicious Only</option>
              <option value="HIGH RISK">High Risk Only</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2 text-[#102a43] focus:outline-none focus:border-[#0B1F51]"
            >
              <option value="ALL">All Document Types (Passport / Visa)</option>
              <option value="Passport">Passport</option>
              <option value="Visa">Visa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#d9e2ec] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#f0f4f8] border-b border-[#d9e2ec] text-[#486581] uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Screening ID</th>
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Traveler Name</th>
                <th className="p-3.5">Document ID</th>
                <th className="p-3.5 text-center">Face Match</th>
                <th className="p-3.5 text-center">Risk Score</th>
                <th className="p-3.5 text-center">Result</th>
                <th className="p-3.5">Officer</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f8] text-[#102a43]">
              {paginatedItems.map((row) => (
                <tr key={row.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3.5 font-bold text-[#0B1F51]">{row.id}</td>
                  <td className="p-3.5 text-[#627d98]">{row.time}</td>
                  <td className="p-3.5 font-semibold text-[#102a43]">{row.name}</td>
                  <td className="p-3.5 text-[#0B1F51]">{row.docId} ({row.docType})</td>
                  <td className="p-3.5 text-center">
                    <span className={`font-bold ${row.faceMatch >= 80 ? "text-[#1e7e48]" : "text-[#b3261e]"}`}>
                      {row.faceMatch}%
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-bold">
                    <span className="font-serif text-sm text-[#0B1F51]">{row.riskScore}/100</span>
                  </td>
                  <td className="p-3.5 text-center">
                    {row.status === "VERIFIED" && <Badge variant="verified">VERIFIED</Badge>}
                    {row.status === "SUSPICIOUS" && <Badge variant="suspicious">SUSPICIOUS</Badge>}
                    {row.status === "HIGH RISK" && <Badge variant="highRisk">HIGH RISK</Badge>}
                  </td>
                  <td className="p-3.5 text-[#627d98] text-[11px]">{row.officer}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        if (row.scenarioId) {
                          setScenario(row.scenarioId);
                          startNewScreening(row.scenarioId);
                        } else {
                          startNewScreening("scenarioA");
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[#f0f4f8] hover:bg-[#0B1F51] hover:text-white text-[#102a43] transition-all border border-[#d9e2ec]"
                      title="Inspect Case"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#d9e2ec] flex items-center justify-between font-mono text-xs text-[#627d98]">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-white border border-[#d9e2ec] disabled:opacity-40 hover:bg-[#f0f4f8] text-[#102a43]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-white border border-[#d9e2ec] disabled:opacity-40 hover:bg-[#f0f4f8] text-[#102a43]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalyticsView = () => {
  const kpis = MOCK_ANALYTICS.kpis;
  const throughput = MOCK_ANALYTICS.hourlyThroughput;
  const docTypes = MOCK_ANALYTICS.docTypeDistribution;
  const riskDist = MOCK_ANALYTICS.riskDistribution;
  const triggers = MOCK_ANALYTICS.topThreatTriggers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Operational Telemetry</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">Border Intelligence & Threat Analytics</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Operational screening performance, threat anomaly distributions, and sensor throughput metrics.
          </p>
        </div>

        <div className="text-xs font-mono text-[#1e7e48] flex items-center gap-1.5 bg-[#eef7f2] px-3 py-1.5 rounded-lg border border-[#1e7e48]/30 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#1e7e48] animate-pulse"></span>
          <span>LIVE TELEMETRY (DELHI T3)</span>
        </div>
      </div>

      {/* KPI 4-Pack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Screenings" value={kpis.dailyScreenings.toLocaleString()} subtitle="Delhi Checkpoint Total" trend="+14.2% vs avg" icon={Activity} color="blue" />
        <StatCard title="Avg Processing Time" value={kpis.avgProcessingTime} subtitle="Per traveler clearance" trend="-0.4s optimized" icon={TrendingUp} color="green" />
        <StatCard title="Detection Rate" value={kpis.detectionRate} subtitle="AI anomaly sensitivity" trend="99.9% precision" icon={Shield} color="amber" />
        <StatCard title="Manual Review Rate" value={kpis.manualReviewRate} subtitle="Escalated to supervisor" trend="Within SLA (5%)" icon={Layers} color="red" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Volume by Hour */}
        <div className="lg:col-span-7 bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-[#0B1F51]">
              Screening Volume by Hour
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1e7e48]"></span>Verified</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#b4690e]"></span>Suspicious</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#b3261e]"></span>High Risk</span>
            </div>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-[#e4ebf5]">
            {throughput.map((item, idx) => {
              const maxVal = 180;
              const vHeight = (item.verified / maxVal) * 100;
              const sHeight = (item.suspicious / maxVal) * 100;
              const hHeight = (item.highRisk / maxVal) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="w-full max-w-[28px] flex flex-col items-center justify-end rounded-t overflow-hidden bg-[#f0f4f8] h-full">
                    <div style={{ height: `${hHeight}%` }} className="w-full bg-[#b3261e]"></div>
                    <div style={{ height: `${sHeight}%` }} className="w-full bg-[#b4690e]"></div>
                    <div style={{ height: `${vHeight}%` }} className="w-full bg-[#1e7e48]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-[#627d98]">{item.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Doc Types */}
        <div className="lg:col-span-5 bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-[#0B1F51]">
            Document Type Distribution
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {docTypes.map((dt, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#486581]">{dt.type}</span>
                  <span className="font-bold text-[#0B1F51]">{dt.count} ({dt.percentage})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f0f4f8] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: dt.percentage, backgroundColor: dt.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#f0f4f8] space-y-2 font-mono text-xs">
            <span className="text-[11px] uppercase font-bold text-[#627d98] block">Risk Score Bands:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {riskDist.map((rd, i) => (
                <div key={i} className="p-2 rounded bg-[#f8fafc] border border-[#d9e2ec]">
                  <div className="text-[#627d98] truncate">{rd.range}</div>
                  <div className="text-[#0B1F51] font-bold">{rd.count} cases ({rd.percent}%)</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Common Triggers */}
      <div className="bg-white border border-[#d9e2ec] rounded-xl p-5 shadow-sm space-y-3 font-sans text-xs">
        <h2 className="font-serif text-base font-bold text-[#0B1F51]">
          Top Anomaly Detection Triggers (Last 24 Hours)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
          {triggers.map((trg, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#f8fafc] border border-[#d9e2ec] flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#102a43]">{trg.name}</div>
                <div className="text-[11px] text-[#627d98] mt-0.5">{trg.count} occurrences</div>
              </div>
              <span className="text-xs font-bold text-[#0B1F51]">{trg.trend}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SettingsView = () => {
  const { user } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">System Parameters</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">Portal & Checkpoint Configuration</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Officer security clearances, risk weight calibrations, sensor thresholds & audit parameters.
          </p>
        </div>

        {saveSuccess && (
          <span className="px-3 py-1.5 rounded-lg bg-[#eef7f2] border border-[#1e7e48]/30 text-[#1e7e48] text-xs font-mono font-bold">
            ✓ Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#d9e2ec] rounded-xl p-6 shadow-sm space-y-6 font-sans text-xs">
        <div className="space-y-4">
          <h2 className="font-serif text-base font-bold text-[#0B1F51]">Officer Clearance & Checkpoint Station</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            <div>
              <label className="block text-[#627d98] mb-1 uppercase font-bold text-[10px]">Officer Name</label>
              <input type="text" defaultValue={user?.officerName || "Officer Vikramaditya Sharma"} className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2.5 text-[#102a43]" />
            </div>
            <div>
              <label className="block text-[#627d98] mb-1 uppercase font-bold text-[10px]">Officer Badge ID</label>
              <input type="text" defaultValue={user?.officerId || "IND-DEL-4092"} disabled className="w-full bg-[#f0f4f8] border border-[#d9e2ec] rounded-lg p-2.5 text-[#0B1F51] font-bold opacity-80" />
            </div>
            <div>
              <label className="block text-[#627d98] mb-1 uppercase font-bold text-[10px]">Station Terminal</label>
              <input type="text" defaultValue="Delhi Terminal 3 — Intl Gate 04" className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2.5 text-[#102a43]" />
            </div>
            <div>
              <label className="block text-[#627d98] mb-1 uppercase font-bold text-[10px]">Clearance Tier</label>
              <input type="text" defaultValue="TIER-3 (BORDER INTELLIGENCE & BIOMETRIC ACTION)" disabled className="w-full bg-[#f0f4f8] border border-[#d9e2ec] rounded-lg p-2.5 text-[#1e7e48] font-bold opacity-80" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#f0f4f8]">
          <button type="submit" className="px-6 py-2.5 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm">
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};