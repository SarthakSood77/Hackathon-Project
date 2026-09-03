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
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("smartcard"); // "smartcard" or "password"
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [checkpointStation, setCheckpointStation] = useState("DEL-T3-G04");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError(null);
    if (!officerId.trim()) {
      setLoginError("Please enter your Officer Government ID / NIC Badge.");
      return;
    }
    if (!password.trim()) {
      setLoginError("Please enter your Security PIN / PKI Passcode.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(officerId, password);
      setIsLoading(false);
    }, 600);
  };

  const fillDemoCredentials = () => {
    setOfficerId("IND-DEL-4092");
    setPassword("Sentinel@2026#Secure");
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#102a43] flex flex-col justify-between font-sans selection:bg-[#0B1F51] selection:text-white">
      {/* Top Tricolor Accent Line */}
      <div className="h-[3.5px] w-full flex flex-shrink-0">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-[#ffffff]"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* Official Gov Header Ribbon */}
      <header className="bg-white border-b border-[#d9e1ec] shadow-[0_1px_4px_rgba(11,31,81,0.06)] py-3 px-4 sm:px-8 sticky top-0 z-30 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#0B1F51" strokeWidth="2"/>
              <circle cx="20" cy="20" r="3" fill="#0B1F51"/>
              <g stroke="#0B1F51" strokeWidth="1">
                <line x1="20" y1="2" x2="20" y2="38"/>
                <line x1="2" y1="20" x2="38" y2="20"/>
                <line x1="6.2" y1="6.2" x2="33.8" y2="33.8"/>
                <line x1="6.2" y1="33.8" x2="33.8" y2="6.2"/>
                <line x1="20" y1="2" x2="20" y2="38" transform="rotate(30 20 20)"/>
                <line x1="20" y1="2" x2="20" y2="38" transform="rotate(60 20 20)"/>
              </g>
            </svg>
            <div>
              <p className="text-[10.5px] uppercase font-mono tracking-wider text-[#5a6e85] font-semibold">
                भारत सरकार · Government of India | गृह मंत्रालय · Ministry of Home Affairs
              </p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1F51] tracking-tight">
                  IDShield AI
                </h1>
                <span className="bg-[#eef2f8] border border-[#c9d5e7] rounded px-2 py-0.5 text-xs font-mono font-semibold text-[#0B1F51]">
                  Bureau of Immigration · Portal Gateway
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef7f2] border border-[#1e7e48]/30 text-[#1e7e48] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#1e7e48] animate-pulse"></span>
              <span>SYSTEM ONLINE · FIPS 140-3 ACTIVE</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 w-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          {/* Left Column: Institutional Portal Overview */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#0B1F51] via-[#102a6b] to-[#07163d] rounded-2xl text-white p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6">
            {/* Subtle Decorative Chakra Watermark */}
            <svg className="absolute -right-16 -bottom-16 w-80 h-80 opacity-5 pointer-events-none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
              <circle cx="20" cy="20" r="3" fill="#FFFFFF"/>
              <g stroke="#FFFFFF" strokeWidth="1">
                <line x1="20" y1="2" x2="20" y2="38"/>
                <line x1="2" y1="20" x2="38" y2="20"/>
                <line x1="6.2" y1="6.2" x2="33.8" y2="33.8"/>
                <line x1="6.2" y1="33.8" x2="33.8" y2="6.2"/>
              </g>
            </svg>

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-mono font-bold tracking-widest text-[#C59B27] uppercase flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#C59B27]"></span>
                AI-Assisted · Biometric-Verified · Tamper-Evident Ledger
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Autonomous Identity & Travel Document Screening System
              </h2>

              <p className="text-sm text-[#d9e2ec] font-sans leading-relaxed max-w-xl">
                High-throughput border security screening platform engineered for international immigration checkpoints and autonomous e-Gates. Built with neural OCR, Error Level Analysis (ELA) forensics, and real-time civil registry cross-verification.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e2b744]">
                    <Scan className="w-4 h-4" />
                    <span>ICAO Doc 9303 MRZ</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">
                    Modulo-10 check digits verified on Document Number, DOB, and Expiry with 7-3-1 weighting.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e2b744]">
                    <Shield className="w-4 h-4" />
                    <span>Digital Forensic ELA</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">
                    Localized recompression gradient analysis detects physical text edits and photo splicing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e2b744]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>1:1 Facial Biometrics</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">
                    Multimodal color & structural concordance with anti-spoofing presentation attack detection.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e2b744]">
                    <Radio className="w-4 h-4" />
                    <span>Central Watchlists</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">
                    Instant zero-trust matching against Interpol Red Notices, lost/stolen records, and sanctions.
                  </p>
                </div>
              </div>
            </div>

            {/* Institutional Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-sans text-[#bcccdc] border-t border-white/10 relative z-10">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
                Secured by SHA-256 Ledger & FIPS 140-3 HSM
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#48bb78]" />
                Compliant with ICAO Doc 9303 & ISO/IEC 19794-5
              </span>
            </div>
          </div>

          {/* Right Column: Officer Authentication Console */}
          <div className="lg:col-span-5 bg-white border border-[#d9e2ec] rounded-2xl p-6 sm:p-8 shadow-xl relative flex flex-col justify-between space-y-6">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-3 border-b border-[#e4ebf5] pb-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#edf4fb] border border-[#0B1F51]/20 flex items-center justify-center text-[#0B1F51] shadow-xs flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0B1F51] leading-tight">
                    Officer Authentication Console
                  </h3>
                  <p className="text-xs text-[#627d98] font-sans mt-0.5">
                    Authorized Immigration & Border Security Personnel Only
                  </p>
                </div>
              </div>

              {/* Auth Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode("smartcard")}
                  className={`py-2 px-3 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                    authMode === "smartcard"
                      ? "bg-[#0B1F51] border-[#0B1F51] text-white shadow-sm"
                      : "bg-[#f0f4f8] border-[#d9e2ec] text-[#486581] hover:bg-[#e4ebf5]"
                  }`}
                >
                  Smart Card / PKI Token
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("password")}
                  className={`py-2 px-3 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                    authMode === "password"
                      ? "bg-[#0B1F51] border-[#0B1F51] text-white shadow-sm"
                      : "bg-[#f0f4f8] border-[#d9e2ec] text-[#486581] hover:bg-[#e4ebf5]"
                  }`}
                >
                  Officer ID & PIN
                </button>
              </div>

              {/* Form Error Banner */}
              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-[#fdf0ee] border border-[#b3261e]/40 text-[#b3261e] text-xs font-mono flex items-center gap-2 shadow-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#b3261e]" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[#486581] mb-1 font-mono uppercase font-bold text-[11px]">
                    Officer Government ID / NIC Badge
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#627d98] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => {
                        setOfficerId(e.target.value);
                        setLoginError(null);
                      }}
                      placeholder="Enter Officer ID (e.g. IND-DEL-4092)"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f8fafc] border border-[#cbd7e6] text-[#102a43] focus:bg-white focus:border-[#0B1F51] focus:ring-2 focus:ring-[#0B1F51]/10 outline-hidden transition-all text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#486581] mb-1 font-mono uppercase font-bold text-[11px]">
                    Security PIN / PKI Passcode
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#627d98] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError(null);
                      }}
                      placeholder="Enter Security PIN / Passcode"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f8fafc] border border-[#cbd7e6] text-[#102a43] focus:bg-white focus:border-[#0B1F51] focus:ring-2 focus:ring-[#0B1F51]/10 outline-hidden transition-all text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#486581] mb-1 font-mono uppercase font-bold text-[11px]">
                    Checkpoint Deployment Station
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#627d98] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={checkpointStation}
                      onChange={(e) => setCheckpointStation(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f8fafc] border border-[#cbd7e6] text-[#102a43] focus:bg-white focus:border-[#0B1F51] focus:ring-2 focus:ring-[#0B1F51]/10 outline-hidden transition-all text-xs font-mono appearance-none cursor-pointer"
                    >
                      <option value="DEL-T3-G04">Delhi Terminal 3 — International Gate 04</option>
                      <option value="MUM-T2-G08">Mumbai Terminal 2 — Gate 08</option>
                      <option value="BLR-T1-G02">Bengaluru Terminal 1 — Gate 02</option>
                      <option value="CCU-T1-G01">Kolkata International — Gate 01</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0B1F51] hover:bg-[#14317a] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Cryptographic Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#C59B27]" />
                      <span>Authenticate & Open Operations Console →</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Demo Credentials Helper */}
            <div className="pt-4 border-t border-[#e4ebf5] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#486581] font-bold uppercase">Demo Officer Credentials:</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[10px] px-2 py-1 rounded bg-[#edf4fb] text-[#1a56a4] hover:bg-[#1a56a4] hover:text-white font-bold transition-all border border-[#1a56a4]/30 cursor-pointer"
                >
                  [ Autofill Demo Credentials ]
                </button>
              </div>
              <div className="text-[#0f3566] text-[11px] font-semibold bg-[#f8fafc] p-2 rounded border border-[#cbd7e6]">
                Officer ID: <span className="font-bold text-[#0B1F51]">IND-DEL-4092</span> (Clearance Tier-3)
                <div className="text-[#627d98] text-[10px] font-sans mt-0.5">Enter any 6+ digit PIN or click Autofill above.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className="bg-white border-t border-[#d9e1ec] py-4 px-4 text-center text-xs font-sans text-[#627d98] space-y-1 flex-shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-[#486581]">
          <span>भारत सरकार | Government of India</span>
          <span>•</span>
          <span>गृह मंत्रालय | Ministry of Home Affairs</span>
          <span>•</span>
          <span>National Informatics Centre (NIC)</span>
        </div>
        <p className="text-[10px] text-[#829ab1] font-mono">
          IDShield AI • Border Security Screening System (SIH Prototype) • Compliant with ICAO Doc 9303, ISO/IEC 19794-5 & NIC Guidelines
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#d9e2ec]">
        <div>
          <div className="flex items-center gap-2 text-[#0B1F51] text-xs font-mono font-bold uppercase">
            <Award className="w-4 h-4 text-[#C59B27]" />
            <span>Bureau of Immigration • Checkpoint Command Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B1F51] font-serif tracking-tight mt-0.5">
            Security Screening Operations Dashboard
          </h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            AI-assisted identity and document verification operations // Station Delhi IGI Terminal 3 Gate 04
          </p>
        </div>

        <button
          onClick={() => startNewScreening()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white text-xs font-bold font-sans tracking-wider uppercase shadow-md transition-all cursor-pointer"
        >
          <Scan className="w-4 h-4 text-[#C59B27]" />
          <span>Start New Screening →</span>
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
      <div className="bg-white border border-[#d9e2ec] rounded-2xl overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4ebf5] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#0B1F51] font-serif flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e7e48] animate-pulse"></span>
              <span>Live Terminal Passenger Audit Feed</span>
            </h2>
            <p className="text-xs text-[#486581] mt-0.5 font-sans">
              Real-time feed of traveler document verification queues and threat index determinations.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 bg-[#f4f7fb] p-1 rounded-lg border border-[#d9e2ec]">
            <Filter className="w-3.5 h-3.5 text-[#627d98] ml-1.5" />
            {["ALL", "VERIFIED", "SUSPICIOUS", "HIGH RISK"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  filterStatus === st
                    ? "bg-[#0B1F51] text-white font-bold shadow-xs"
                    : "text-[#486581] hover:text-[#0B1F51] hover:bg-[#e4ebf5]"
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
            <thead className="bg-[#edf4fb] border-b border-[#d9e2ec] text-[#0B1F51] uppercase text-[10px] font-bold">
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
            <tbody className="divide-y divide-[#e4ebf5] text-[#102a43]">
              {filteredScreenings.map((row, idx) => {
                const isHigh = row.status === "HIGH RISK";
                const isSusp = row.status === "SUSPICIOUS";
                const isVer = row.status === "VERIFIED";

                return (
                  <tr
                    key={idx}
                    className="hover:bg-[#f4f7fb] transition-colors group cursor-pointer"
                    onClick={() => {
                      if (row.scenarioId) {
                        setScenario(row.scenarioId);
                        startNewScreening(row.scenarioId);
                      }
                    }}
                  >
                    <td className="p-3 text-[#627d98]">{row.time}</td>
                    <td className="p-3 font-bold text-[#1a56a4]">{row.docId}</td>
                    <td className="p-3 font-semibold text-[#102a43] group-hover:text-[#0B1F51] transition-colors">
                      {row.name}
                    </td>
                    <td className="p-3 text-[#486581]">{row.docType}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`font-bold ${
                          row.faceMatch >= 80 ? "text-[#1e7e48]" : row.faceMatch >= 50 ? "text-[#b4690e]" : "text-[#b3261e]"
                        }`}
                      >
                        {row.faceMatch}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.riskScore <= 20
                            ? "bg-[#eef7f2] text-[#1e7e48] border border-[#1e7e48]/30"
                            : row.riskScore <= 70
                            ? "bg-[#fdf8eb] text-[#b4690e] border border-[#b4690e]/30"
                            : "bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/30"
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
                        className="p-1.5 rounded-lg bg-[#edf4fb] hover:bg-[#0B1F51] hover:text-white text-[#0B1F51] transition-all border border-[#cbd7e6] cursor-pointer"
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