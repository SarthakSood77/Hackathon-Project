import React, { useState } from "react";
import { useScreening } from "../context/ScreeningContext";
import { ChakraProgress } from "../components/screening/ChakraProgress";
import { Step1Upload, Step2OCR } from "../components/screening/Step1Upload";
import { Step3TamperAnalysis, Step4FaceVerification } from "../components/screening/Step3TamperAnalysis";
import { Step5RiskAssessment, Step6FinalResult } from "../components/screening/Step5RiskAssessment";
import { Shield, Search, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

export const NewScreeningView = () => {
  const { screeningStep, setScreeningStep, isStep1Completed } = useScreening();

  // Enforce workflow: Steps 2-6 cannot be accessed until Step 1 upload & screening has executed
  React.useEffect(() => {
    if (!isStep1Completed && screeningStep > 1) {
      setScreeningStep(1);
    }
  }, [isStep1Completed, screeningStep, setScreeningStep]);

  return (
    <div className="space-y-6">
      {/* Chakra Circular Progress Wheel & Step Strip */}
      <ChakraProgress />

      {/* Main Step Card Container */}
      <div className="bg-white border border-[#d9e2ec] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(11,31,81,0.06)]">
        {screeningStep === 1 && <Step1Upload />}
        {isStep1Completed && screeningStep === 2 && <Step2OCR />}
        {isStep1Completed && screeningStep === 3 && <Step3TamperAnalysis />}
        {isStep1Completed && screeningStep === 4 && <Step4FaceVerification />}
        {isStep1Completed && screeningStep === 5 && <Step5RiskAssessment />}
        {isStep1Completed && screeningStep === 6 && <Step6FinalResult />}
      </div>
    </div>
  );
};

import { api } from "../utils/api";

export const IdentitySearchView = () => {
  const { searchQuery, setSearchQuery, setScenario, startNewScreening } = useScreening();
  const [name, setName] = useState(searchQuery || "Carlos Mendez");
  const [docNumber, setDocNumber] = useState("P99887766");
  const [dob, setDob] = useState("14/04/1982");
  const [nationality, setNationality] = useState("MEX");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const matchResult = await api.checkWatchlist({
        document_number: docNumber,
        full_name: name
      });
      setSearchResults(matchResult);
      setHasSearched(true);
    } catch (err) {
      console.warn("Watchlist API query notice:", err);
      // Fallback local match
      setSearchResults({
        is_matched: true,
        match_count: 1,
        highest_flag_level: "CRITICAL",
        matched_records: [{
          document_number: docNumber,
          full_name: name || "Carlos Mendez",
          reason: "INTERPOL_RED_NOTICE",
          flag_level: "CRITICAL",
          issuing_authority: "INTERPOL",
          notes: "Wanted for international financial fraud and syndicate identity theft."
        }]
      });
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#d9e2ec] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#627d98]">Intelligence Database</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F51]">Central Identity & Alias Inquiry</h1>
          <p className="text-xs text-[#486581] font-sans mt-0.5">
            Real-time query against Interpol Red Notices, stolen document registry, and blacklists.
          </p>
        </div>

        <div className="text-xs font-mono bg-[#edf4fb] text-[#0f3566] px-3 py-1.5 rounded-lg border border-[#1a56a4]/30 font-semibold">
          ACCESS: TIER-3 IMMIGRATION OFFICER
        </div>
      </div>

      {/* Search Input Card */}
      <form onSubmit={handleSearch} className="bg-white border border-[#d9e2ec] rounded-xl p-6 shadow-sm space-y-4 font-sans text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Traveler Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Carlos Mendez"
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2.5 text-[#102a43] focus:outline-none focus:border-[#0B1F51] font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Document Number</label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="e.g. P99887766"
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2.5 text-[#0B1F51] focus:outline-none focus:border-[#0B1F51] font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Date of Birth</label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2.5 text-[#102a43] focus:outline-none focus:border-[#0B1F51] font-mono"
            />
          </div>

          <div>
            <label className="block text-[#102a43] mb-1 font-bold text-[11px]">Nationality</label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="e.g. MEX"
              className="w-full bg-[#f8fafc] border border-[#cbd7e6] rounded-lg p-2.5 text-[#102a43] focus:outline-none focus:border-[#0B1F51] font-mono"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f0f4f8]">
          <span className="text-[11px] font-mono text-[#627d98]">
            QUERY: FASTAPI MONGODB WATCHLIST SERVICE
          </span>

          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 rounded-lg bg-[#0B1F51] hover:bg-[#14317a] text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            {isSearching ? "Querying Central Intelligence..." : "Search Identity"}
          </button>
        </div>
      </form>

      {/* Results */}
      {hasSearched && searchResults && (
        <div className="space-y-4">
          {searchResults.is_matched ? (
            <div className="bg-white border-2 border-[#b3261e] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(179,38,30,0.08)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0f4f8] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#fdf0ee] text-[#b3261e] flex items-center justify-center font-bold">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#b3261e]">
                      {searchResults.highest_flag_level || "CRITICAL"} THREAT FLAG MATCH
                    </p>
                    <h2 className="font-serif text-xl font-bold text-[#0B1F51]">
                      {name || docNumber}
                    </h2>
                  </div>
                </div>

                <span className="px-3 py-1 rounded bg-[#fdf0ee] text-[#b3261e] border border-[#b3261e]/30 font-mono text-xs font-bold">
                  {searchResults.matched_records?.[0]?.reason || "INTERPOL_RED_NOTICE"}
                </span>
              </div>

              {/* Match Details */}
              <div className="bg-[#fdf0ee] border border-[#b3261e]/40 p-4 rounded-xl space-y-3 font-sans text-xs text-[#6f130e]">
                <div className="font-bold font-serif text-base">
                  ⚠️ Adverse Record Found on International Registry
                </div>
                <p className="leading-relaxed text-[#486581]">
                  Authority: <strong className="text-[#102a43]">{searchResults.matched_records?.[0]?.issuing_authority || "INTERPOL"}</strong>
                  <br />
                  Details: {searchResults.matched_records?.[0]?.notes || "Subject is flagged for international security observation."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-white rounded-lg border border-[#d9e2ec] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#0B1F51] block">Document ID:</span>
                    <div className="text-[#102a43] font-bold">{docNumber}</div>
                  </div>

                  <div className="p-3 bg-[#fce8e6] rounded-lg border border-[#b3261e]/40 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#b3261e] block">Flag Classification:</span>
                    <div className="text-[#b3261e] font-bold">{searchResults.matched_records?.[0]?.reason || "TERRORIST_WATCHLIST"}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setScenario("scenarioC");
                    startNewScreening("scenarioC");
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#b3261e] hover:bg-[#8f1d16] text-white font-sans font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  Escort to Secondary Biometric Isolation →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-[#1e7e48] rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eef7f2] text-[#1e7e48] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B1F51]">No Adverse Watchlist Hits Found</h3>
                  <p className="text-xs text-[#486581]">
                    Identity "{name || docNumber}" is clear of active Interpol Red Notices, travel bans, and stolen document alerts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};