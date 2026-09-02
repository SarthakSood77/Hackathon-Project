import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useScreening } from "../context/ScreeningContext";
import {
  Shield,
  Lock,
  User,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Radio,
  Server,
  Sparkles,
  Building2,
  Scan,
  TrendingUp,
  Filter,
  Eye,
  ChevronRight,
  Award,
  Globe
} from "lucide-react";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/common/Badge";

export const LoginView = () => {
  const { login } = useAuth();
  const [officerId, setOfficerId] = useState("IND-DEL-4092");
  const [password, setPassword] = useState("••••••••••••");
  const [authMode, setAuthMode] = useState("smartcard"); // "smartcard" or "password"
  const [isLoading, setIsLoading] = useState(false);
  const [checkpointStation, setCheckpointStation] = useState("DEL-T3-G04");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(officerId, password);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070e1a] flex flex-col justify-between font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Tricolor Accent Line */}
      <div className="h-[4px] w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Official Gov Header Ribbon */}
      <header className="bg-[#0b172a] border-b border-slate-800 py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-lg shadow-sm">
              🏛️
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 tracking-wide">
                भारत सरकार | Government of India
              </div>
              <div className="text-xs text-slate-300 font-medium">
                गृह मंत्रालय | Ministry of Home Affairs • Bureau of Immigration
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded bg-red-950/80 text-rose-300 border border-red-500/40 font-bold">
              RESTRICTED ACCESS — AUTHORIZED IMMIGRATION PERSONNEL ONLY
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Container */}
      <div className="w-full max-w-lg mx-auto my-8 px-4">
        <div className="bg-[#0c182c] border-2 border-slate-700/90 rounded-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Institutional Header */}
          <div className="text-center mb-6 border-b border-slate-700/80 pb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#132845] border-2 border-amber-400/50 text-amber-400 mb-2 shadow-md">
              <Shield className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-extrabold font-mono tracking-wider text-white">SENTINEL AI</h1>
            <p className="text-xs font-mono text-amber-400 font-bold uppercase mt-0.5">
              Border Security Intelligence & Document Verification System
            </p>
            <p className="text-[11px] text-slate-300 font-sans mt-1">
              National Border Control Operations Portal // SIH Prototype
            </p>
          </div>

          {/* Auth Method Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => setAuthMode("smartcard")}
              className={`py-2 px-3 rounded border text-center font-bold transition-all ${
                authMode === "smartcard"
                  ? "bg-[#132845] border-amber-400 text-amber-300 shadow-sm"
                  : "bg-[#080f1e] border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              Smart Card / PKI Token
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`py-2 px-3 rounded border text-center font-bold transition-all ${
                authMode === "password"
                  ? "bg-[#132845] border-amber-400 text-amber-300 shadow-sm"
                  : "bg-[#080f1e] border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              Officer ID & PIN
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 mb-1 uppercase font-bold text-[11px]">
                Officer Government ID / NIC Badge
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. IND-DEL-4092"
                  className="w-full bg-[#070e1b] border border-slate-600 rounded p-2 pl-9 text-slate-100 focus:outline-none focus:border-amber-400 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 uppercase font-bold text-[11px]">
                Security PIN / PKI Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter encrypted passcode"
                  className="w-full bg-[#070e1b] border border-slate-600 rounded p-2 pl-9 text-slate-100 focus:outline-none focus:border-amber-400 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 uppercase font-bold text-[11px]">
                Checkpoint Deployment Station
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={checkpointStation}
                  onChange={(e) => setCheckpointStation(e.target.value)}
                  className="w-full bg-[#070e1b] border border-slate-600 rounded p-2 pl-9 text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="DEL-T3-G04">Delhi Terminal 3 — International Gate 04</option>
                  <option value="DEL-T3-G02">Delhi Terminal 3 — International Gate 02</option>
                  <option value="BOM-T2-G09">Mumbai Terminal 2 — Gate 09</option>
                  <option value="BLR-T2-G01">Bengaluru Terminal 2 — Gate 01</option>
                </select>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 border border-blue-400/40 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Validating Cryptographic HSM Token...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Authenticate & Open Operations Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-5 p-3 rounded bg-[#070e1b] border border-slate-700 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="text-amber-400 font-bold uppercase text-[10px]">
              Smart India Hackathon Prototype Credentials:
            </div>
            <div>Officer ID: <span className="text-white font-bold">IND-DEL-4092</span> (Clearance Tier-3)</div>
            <div>Authentication: <span className="text-slate-300">Pre-authenticated for jury review</span></div>
          </div>
        </div>
      </div>

      {/* Official Government Footer */}
      <footer className="bg-[#050b14] border-t border-slate-800 py-4 px-4 text-center text-xs font-sans text-slate-400 space-y-1">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-300">
          <span>भारत सरकार | Government of India</span>
          <span>•</span>
          <span>गृह मंत्रालय | Ministry of Home Affairs</span>
          <span>•</span>
          <span>National Informatics Centre (NIC)</span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">
          SENTINEL AI • Border Security Screening System (SIH Prototype) • Compliant with ICAO Doc 9303 & ISO/IEC 19794-5
        </p>
      </footer>
    </div>
  );
};

export const DashboardView = () => {
  const { stats, screenings, startNewScreening, setScenario, setActiveTab } = useScreening();
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filteredScreenings = screenings.filter((scr) => {
    if (filterStatus === "ALL") return true;
    return scr.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Government Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
            <Award className="w-4 h-4" />
            <span>Bureau of Immigration • Checkpoint Command Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 font-mono tracking-tight mt-0.5">
            Security Screening Dashboard
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            AI-assisted identity and document verification operations // Station Delhi Terminal 3 Gate 04
          </p>
        </div>

        <button
          onClick={() => startNewScreening()}
          className="flex items-center gap-2 px-5 py-2.5 rounded bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 border border-blue-400/40 text-white text-xs font-bold font-mono tracking-wider uppercase shadow-md transition-all"
        >
          <Scan className="w-4 h-4" />
          <span>Start New Screening</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Screenings"
          value={stats.totalScreenings.toLocaleString()}
          subtitle="Processed today"
          trend={stats.trends.total}
          icon={Scan}
          color="blue"
        />

        <StatCard
          title="Verified & Cleared"
          value={stats.verified.toLocaleString()}
          subtitle="Auto-cleared"
          trend={stats.trends.verified}
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          title="Suspicious / Audit"
          value={stats.suspicious.toLocaleString()}
          subtitle="Secondary audit"
          trend={stats.trends.suspicious}
          icon={AlertTriangle}
          color="amber"
          alertCount={12}
        />

        <StatCard
          title="High Risk / Hold"
          value={stats.highRisk.toLocaleString()}
          subtitle="Border hold & isolated"
          trend={stats.trends.highRisk}
          icon={Shield}
          color="red"
          alertCount={stats.highRisk}
        />
      </div>

      {/* Live Screening Overview Section */}
      <div className="bg-[#0b172a] border border-slate-700/80 rounded-xl overflow-hidden shadow-lg space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Screening Overview</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              Real-time feed of traveler document verification queues and threat index determinations.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {["ALL", "VERIFIED", "SUSPICIOUS", "HIGH RISK"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                  filterStatus === st
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070e1a] border-b border-slate-700 text-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Document ID</th>
                <th className="p-3">Traveler Name</th>
                <th className="p-3">Doc Type</th>
                <th className="p-3 text-center">Face Match</th>
                <th className="p-3 text-center">Risk Score</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {filteredScreenings.map((row, idx) => {
                const isHigh = row.status === "HIGH RISK";
                const isSusp = row.status === "SUSPICIOUS";
                const isVer = row.status === "VERIFIED";

                return (
                  <tr
                    key={idx}
                    className="hover:bg-[#0f2139] transition-colors group cursor-pointer"
                    onClick={() => {
                      if (row.scenarioId) {
                        setScenario(row.scenarioId);
                        startNewScreening(row.scenarioId);
                      }
                    }}
                  >
                    <td className="p-3 text-slate-400">{row.time}</td>
                    <td className="p-3 font-bold text-amber-400">{row.docId}</td>
                    <td className="p-3 font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {row.name}
                    </td>
                    <td className="p-3 text-slate-300">{row.docType}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`font-bold ${
                          row.faceMatch >= 80 ? "text-emerald-400" : row.faceMatch >= 50 ? "text-amber-400" : "text-rose-400"
                        }`}
                      >
                        {row.faceMatch}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.riskScore <= 20
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : row.riskScore <= 70
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {row.riskScore.toString().padStart(2, "0")}/100
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {isVer && <Badge variant="verified">VERIFIED</Badge>}
                      {isSusp && <Badge variant="suspicious">SUSPICIOUS</Badge>}
                      {isHigh && <Badge variant="highRisk">HIGH RISK</Badge>}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (row.scenarioId) {
                            setScenario(row.scenarioId);
                            startNewScreening(row.scenarioId);
                          } else {
                            startNewScreening("scenarioA");
                          }
                        }}
                        className="p-1.5 rounded bg-[#132742] hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all border border-slate-700"
                        title="Inspect Screening Audit"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};