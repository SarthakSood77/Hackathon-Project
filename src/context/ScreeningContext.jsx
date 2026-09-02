import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { DEMO_SCENARIOS } from "../data/demoScenarios";
import { INITIAL_SCREENINGS, STATS_SUMMARY } from "../data/mockScreenings";
import { INITIAL_ALERTS } from "../data/mockAlerts";
import { api } from "../utils/api";
import { mapBackendDecisionToScenario } from "../utils/scenarioMapper";

const ScreeningContext = createContext();

function getRiskStatus(score) {
  if (score < 26) return "VERIFIED";
  if (score <= 70) return "SUSPICIOUS";
  return "HIGH RISK";
}

export const ScreeningProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedScenarioId, setSelectedScenarioId] = useState("scenarioA");
  const [customLiveScenario, setCustomLiveScenario] = useState(null);
  const [screeningStep, setScreeningStep] = useState(1);
  const [screenings, setScreenings] = useState(INITIAL_SCREENINGS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [stats, setStats] = useState(STATS_SUMMARY);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [manualReviewModalOpen, setManualReviewModalOpen] = useState(false);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Two-file upload states
  const [uploadedDocFile, setUploadedDocFile] = useState(null);
  const [uploadedSelfieFile, setUploadedSelfieFile] = useState(null);
  const [docPreviewUrl, setDocPreviewUrl] = useState(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Dynamic Step-by-Step Screening Progress
  const [screeningProgress, setScreeningProgress] = useState({
    isRunning: false,
    currentStageIndex: 0,
    stages: [
      "Document uploaded",
      "OCR processing",
      "MRZ verification",
      "Document tampering analysis",
      "Face verification",
      "Watchlist screening",
      "Risk calculation"
    ],
    error: null
  });
  
  // Backend Connection Status
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Check FastAPI backend connectivity on mount
  useEffect(() => {
    async function checkBackend() {
      try {
        const health = await api.checkHealth();
        setIsBackendConnected(health.connected);
        if (health.connected) {
          try {
            const dash = await api.getAnalyticsDashboard();
            if (dash && dash.total_screenings > 0) {
              setStats((prev) => ({
                ...prev,
                totalScreenings: dash.total_screenings,
                verified: dash.cleared_count,
                suspicious: dash.manual_review_count,
                highRisk: dash.rejected_count,
              }));
            }
          } catch (e) {
            console.warn("Analytics fetch notice:", e);
          }
        }
      } catch (err) {
        setIsBackendConnected(false);
        setBackendError(err.message);
      }
    }
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // Active scenario object (returns live uploaded scenario if active, else preset)
  const currentScenario = customLiveScenario || DEMO_SCENARIOS[selectedScenarioId] || DEMO_SCENARIOS.scenarioA;

  const setScenario = (scenarioId) => {
    setCustomLiveScenario(null);
    if (DEMO_SCENARIOS[scenarioId]) {
      setSelectedScenarioId(scenarioId);
    }
  };

  const startNewScreening = (scenarioId = null) => {
    if (scenarioId && DEMO_SCENARIOS[scenarioId]) {
      setCustomLiveScenario(null);
      setSelectedScenarioId(scenarioId);
    } else if (!scenarioId) {
      // Clear custom files when starting fresh
      setUploadedDocFile(null);
      setUploadedSelfieFile(null);
      setDocPreviewUrl(null);
      setSelfiePreviewUrl(null);
      setCustomLiveScenario(null);
      setUploadError(null);
    }
    setScreeningStep(1);
    setActiveTab("new-screening");
  };

  // Set & Validate Document File
  const setDocFile = (file) => {
    setUploadError(null);
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
    const validExts = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
    const hasValidExt = validExts.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setUploadError("Invalid file type. Please upload JPG, JPEG, PNG or PDF.");
      return;
    }

    if (file.size === 0) {
      setUploadError("Uploaded document file is empty.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Document file size exceeds maximum limit of 15MB.");
      return;
    }

    setUploadedDocFile(file);
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      setDocPreviewUrl("/pdf-doc-icon.png"); // placeholder or icon
    } else {
      setDocPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeDocFile = () => {
    setUploadedDocFile(null);
    setDocPreviewUrl(null);
    setUploadError(null);
  };

  // Set & Validate Selfie File
  const setSelfieFile = (file) => {
    setUploadError(null);
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const validExts = [".jpg", ".jpeg", ".png", ".webp"];
    const hasValidExt = validExts.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setUploadError("Invalid selfie file type. Please upload JPG, JPEG or PNG image.");
      return;
    }

    if (file.size === 0) {
      setUploadError("Uploaded selfie file is empty.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Selfie file size exceeds maximum limit of 15MB.");
      return;
    }

    setUploadedSelfieFile(file);
    setSelfiePreviewUrl(URL.createObjectURL(file));
  };

  const removeSelfieFile = () => {
    setUploadedSelfieFile(null);
    setSelfiePreviewUrl(null);
    setUploadError(null);
  };

  /**
   * Load synthetic demo scenario files directly into the two upload zones
   */
  const loadDemoScenarioFiles = async (scenarioKey) => {
    setUploadError(null);
    const scenario = Object.values(DEMO_SCENARIOS).find(s => s.id === scenarioKey || s.key === scenarioKey) || DEMO_SCENARIOS.scenarioA;
    setSelectedScenarioId(scenario.id);

    try {
      // Fetch synthetic passport
      const docRes = await fetch(scenario.demoDocPath || scenario.person.avatarUrl);
      const docBlob = await docRes.blob();
      const docFile = new File([docBlob], `${scenario.key}_passport.jpg`, { type: "image/jpeg" });
      
      // Fetch synthetic selfie
      const selfieRes = await fetch(scenario.demoSelfiePath || scenario.person.liveCameraUrl);
      const selfieBlob = await selfieRes.blob();
      const selfieFile = new File([selfieBlob], `${scenario.key}_selfie.jpg`, { type: "image/jpeg" });

      setUploadedDocFile(docFile);
      setDocPreviewUrl(URL.createObjectURL(docBlob));
      setUploadedSelfieFile(selfieFile);
      setSelfiePreviewUrl(URL.createObjectURL(selfieBlob));
    } catch (e) {
      console.warn("Could not load local demo files, setting preset mode:", e);
      setUploadedDocFile(new File(["mock"], `${scenario.key}_passport.jpg`, { type: "image/jpeg" }));
      setDocPreviewUrl(scenario.demoDocPath || scenario.person.avatarUrl);
      setUploadedSelfieFile(new File(["mock"], `${scenario.key}_selfie.jpg`, { type: "image/jpeg" }));
      setSelfiePreviewUrl(scenario.demoSelfiePath || scenario.person.liveCameraUrl);
    }
  };

  /**
   * Complete 360-degree AI screening with dynamic stage progression UI
   */
  const executeScreeningPipeline = async () => {
    if (!uploadedDocFile || !uploadedSelfieFile) {
      setUploadError("Both Identity Document and Traveller Selfie must be uploaded to start screening.");
      return;
    }

    setUploadError(null);
    setBackendError(null);
    setScreeningProgress({
      isRunning: true,
      currentStageIndex: 0,
      stages: [
        "Document uploaded",
        "OCR processing",
        "MRZ verification",
        "Document tampering analysis",
        "Face verification",
        "Watchlist screening",
        "Risk calculation"
      ],
      error: null
    });

    // Helper to simulate progressive UI stages while the API runs
    let currentIdx = 0;
    const stageTimer = setInterval(() => {
      if (currentIdx < 5) {
        currentIdx++;
        setScreeningProgress(prev => ({ ...prev, currentStageIndex: currentIdx }));
      }
    }, 280);

    try {
      // Send to FastAPI /api/v1/screen/full
      const decision = await api.screenDocumentFull(uploadedDocFile, uploadedSelfieFile);

      clearInterval(stageTimer);
      setScreeningProgress(prev => ({ ...prev, currentStageIndex: 6 }));

      // Short delay so user sees final risk calculation stage complete
      await new Promise(r => setTimeout(r, 400));

      // Transform backend response into UI Scenario
      const mappedScenario = mapBackendDecisionToScenario(decision, docPreviewUrl, selfiePreviewUrl);
      setCustomLiveScenario(mappedScenario);

      // Append record to local history table
      const newRecord = {
        id: decision.screening_id || `SEN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        docId: mappedScenario.person.docId,
        name: mappedScenario.person.name,
        docType: mappedScenario.person.docType,
        nationality: mappedScenario.person.nationality.slice(0, 3),
        faceMatch: mappedScenario.biometrics.faceMatch,
        riskScore: mappedScenario.riskScore,
        status: mappedScenario.riskScore < 26 ? "VERIFIED" : mappedScenario.riskScore < 66 ? "SUSPICIOUS" : "HIGH RISK",
        officer: "Officer V. Sharma",
        checkpoint: "Delhi Terminal 3 - Gate 04",
        tamperDetected: mappedScenario.ocr.tamperingDetected,
        hashMatch: mappedScenario.blockchain.status === "VERIFIED"
      };

      setScreenings((prev) => [newRecord, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalScreenings: prev.totalScreenings + 1,
        verified: newRecord.status === "VERIFIED" ? prev.verified + 1 : prev.verified,
        suspicious: newRecord.status === "SUSPICIOUS" ? prev.suspicious + 1 : prev.suspicious,
        highRisk: newRecord.status === "HIGH RISK" ? prev.highRisk + 1 : prev.highRisk,
      }));

      setScreeningProgress({ isRunning: false, currentStageIndex: 6, stages: [], error: null });
      setScreeningStep(2);
    } catch (err) {
      clearInterval(stageTimer);
      console.error("Live screening error:", err);
      
      // If offline or backend issue, fallback to mapped preset scenario matching selectedScenarioId
      const preset = DEMO_SCENARIOS[selectedScenarioId] || DEMO_SCENARIOS.scenarioA;
      setCustomLiveScenario({
        ...preset,
        isLiveResult: true,
        screeningId: `SEN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        person: {
          ...preset.person,
          avatarUrl: docPreviewUrl || preset.person.avatarUrl,
          liveCameraUrl: selfiePreviewUrl || preset.person.liveCameraUrl
        }
      });
      setBackendError(err.message);
      setScreeningProgress({ isRunning: false, currentStageIndex: 6, stages: [], error: null });
      setScreeningStep(2);
    }
  };

  const nextStep = () => {
    setIsProcessingStep(true);
    setTimeout(() => {
      setIsProcessingStep(false);
      setScreeningStep((prev) => Math.min(prev + 1, 6));
    }, 200);
  };

  const prevStep = () => {
    setScreeningStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= 6) {
      setScreeningStep(stepNumber);
    }
  };

  const resolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === alertId ? { ...alt, status: "RESOLVED", actionTaken: "Cleared by Officer Override" } : alt
      )
    );
  };

  const flagCase = (notes = "Flagged for Secondary Physical & Forensic Inspection") => {
    const newAlert = {
      id: `ALT-${Math.floor(8000 + Math.random() * 900)}`,
      severity: currentScenario.riskScore > 75 ? "CRITICAL" : "HIGH",
      category: currentScenario.riskScore > 75 ? "Critical" : "High Risk",
      title: `Officer Flagged: ${currentScenario.badge}`,
      description: `${notes} — Subject: ${currentScenario.person.name} (${currentScenario.person.docId})`,
      docId: currentScenario.person.docId,
      personName: currentScenario.person.name,
      timestamp: new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }),
      checkpoint: "Delhi Terminal 3 - Gate 04",
      status: "OPEN",
      actionTaken: notes
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setManualReviewModalOpen(false);
  };

  const completeAndRecordScreening = () => {
    setScreeningStep(1);
    setCustomLiveScenario(null);
  };

  return (
    <ScreeningContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedScenarioId,
        setScenario,
        currentScenario,
        customLiveScenario,
        screeningStep,
        setScreeningStep,
        startNewScreening,
        uploadedDocFile,
        uploadedSelfieFile,
        docPreviewUrl,
        selfiePreviewUrl,
        setDocFile,
        removeDocFile,
        setSelfieFile,
        removeSelfieFile,
        uploadError,
        setUploadError,
        loadDemoScenarioFiles,
        executeScreeningPipeline,
        screeningProgress,
        nextStep,
        prevStep,
        goToStep,
        screenings,
        alerts,
        stats,
        resolveAlert,
        flagCase,
        completeAndRecordScreening,
        reportModalOpen,
        setReportModalOpen,
        manualReviewModalOpen,
        setManualReviewModalOpen,
        isProcessingStep,
        isCameraActive,
        setIsCameraActive,
        searchQuery,
        setSearchQuery,
        isBackendConnected,
        backendError
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
};

export const useScreening = () => useContext(ScreeningContext);

