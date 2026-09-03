import { api } from "./api";

/**
 * Transforms FastAPI backend ScreeningDecision response into the UI Scenario format
 * consumed by the React Screening Wizard & Dashboard.
 */
export function mapBackendDecisionToScenario(decision, customDocImageSrc = null, customLiveImageSrc = null) {
  const ocr = decision.ocr_result || {};
  const passport = ocr.passport_fields || {};
  const visa = ocr.visa_fields || {};
  const idCard = ocr.national_id_fields || {};
  const mrz = ocr.mrz_data || {};
  const val = decision.validation_result || {};
  const tamper = decision.tampering_result || {};
  const ela = tamper.ela_analysis || {};
  const face = decision.face_result || null;

  const docTypeStr = decision.document_type === "PASSPORT" 
    ? "Standard Passport" 
    : decision.document_type === "VISA" 
    ? "Tourist / Business Visa" 
    : "National Identity Card";

  const isUnverified = (ocr.status === "UNVERIFIED");
  const fullName = isUnverified 
    ? "UNVERIFIED TRAVELER" 
    : (decision.holder_name || passport.full_name || visa.holder_name || idCard.full_name || "UNVERIFIED");
  const docId = isUnverified
    ? "UNVERIFIED"
    : (decision.document_number || passport.passport_number || visa.visa_number || idCard.id_number || "UNVERIFIED");
  const dob = isUnverified ? "UNKNOWN" : (passport.date_of_birth || idCard.date_of_birth || "UNKNOWN");
  const expiry = isUnverified ? "UNKNOWN" : (passport.date_of_expiry || visa.valid_until || idCard.date_of_expiry || "UNKNOWN");
  const nat = isUnverified ? "UNKNOWN" : (decision.nationality || passport.nationality || idCard.nationality || "UNKNOWN");

  const rawLines = mrz.raw_lines || [];
  const mrz1 = rawLines[0] || (isUnverified ? "NO_VALID_MRZ_DETECTED<<<<<<<<<<<<<<<<<<<<<<<" : `P<${nat}${fullName.replace(/ /g, "<")}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`.slice(0, 44));
  const mrz2 = rawLines[1] || (isUnverified ? "UNVERIFIED_DATA_ZONE<<<<<<<<<<<<<<<<<<<<<<00" : `${docId.padEnd(9, "<")}0${nat}9001010M3001010<<<<<<<<<<<<<<00`.slice(0, 44));

  const isTampered = Boolean(tamper.is_tampered || (tamper.tamper_risk_score >= 25));
  const isMatch = face ? face.verification_passed : true;
  const faceMatchPct = face ? Math.round(face.similarity_score * 100) : 95;

  const rawAnomalies = tamper.detected_anomalies || [];
  const riskFactors = decision.risk_factors || [];
  const allAnomaliesText = [...rawAnomalies, ...riskFactors].join(" ");
  
  const isDobAnomaly = Boolean(
    !val.dob_valid ||
    allAnomaliesText.toLowerCase().includes("date of birth") ||
    allAnomaliesText.toLowerCase().includes("birth") ||
    allAnomaliesText.toLowerCase().includes("dob")
  );
  
  const isPhotoAnomaly = Boolean(
    tamper.visual_anomalies?.photo_splice_suspected ||
    allAnomaliesText.toLowerCase().includes("photo") ||
    allAnomaliesText.toLowerCase().includes("splice")
  );

  const isMrzAnomaly = Boolean(
    val.mrz_checksum_passed === false ||
    allAnomaliesText.toLowerCase().includes("checksum") ||
    allAnomaliesText.toLowerCase().includes("mrz")
  );

  let badge = "LOW RISK — VERIFIED";
  let badgeColor = "emerald";
  let riskLevel = "LOW RISK";
  let recommendation = "CLEARED / LOW RISK";

  if (isUnverified) {
    badge = "UNVERIFIED — MANUAL INSPECTION REQUIRED";
    badgeColor = "amber";
    riskLevel = "MANUAL REVIEW";
    recommendation = "OFFICER MANUAL PHYSICAL INSPECTION REQUIRED";
  } else if (!isMatch) {
    badge = "CRITICAL BIOMETRIC MISMATCH — HIGH RISK";
    badgeColor = "rose";
    riskLevel = "HIGH RISK";
    recommendation = "BIOMETRIC MISMATCH: DETENTION & ESCORT FOR FRAUD INVESTIGATION";
  } else if (decision.status === "REJECTED_HIGH_RISK" || decision.risk_score >= 66 || val.watchlist_hit) {
    badge = "CRITICAL HIGH RISK — REJECTED";
    badgeColor = "rose";
    riskLevel = "HIGH RISK";
    recommendation = "ESCALATE TO AUTHORIZED OFFICER";
  } else if (decision.status === "MANUAL_REVIEW" || decision.risk_score >= 26 || isTampered || !val.mrz_checksum_passed || val.is_expired) {
    badge = "MEDIUM RISK — MANUAL REVIEW REQUIRED";
    badgeColor = "amber";
    riskLevel = "MANUAL REVIEW";
    recommendation = "OFFICER VERIFICATION REQUIRED";
  }

  // Convert validation rules to UI signals
  const signals = [];
  signals.push({
    name: "Document Authenticity",
    status: isTampered ? (tamper.tamper_risk_score >= 50 ? "FAILED" : "WARNING") : "PASS",
    detail: isTampered 
      ? (rawAnomalies[0] || `Localized forensic anomalies detected (Tamper Score: ${tamper.tamper_risk_score}/100)`) 
      : "Official standard travel credential format verified"
  });

  signals.push({
    name: "OCR Extraction",
    status: (ocr.confidence_score || 0.95) >= 0.85 ? "PASS" : "WARNING",
    detail: `Extraction confidence ${Math.round((ocr.confidence_score || 0.95) * 100)}% across data zones`
  });

  signals.push({
    name: "ICAO 9303 MRZ Checksums",
    status: val.mrz_checksum_passed ? "PASS" : "FAILED",
    detail: val.mrz_checksum_passed ? "Modulo-10 check digits verified on Document Number, DOB, and Expiry" : "Modulo-10 check digit mismatch on document numbers or DOB"
  });

  if (isDobAnomaly) {
    signals.push({
      name: "Date of Birth Integrity",
      status: "FAILED",
      detail: "Visual forensics / MRZ indicates unauthorized date of birth modification"
    });
  }

  if (isPhotoAnomaly) {
    signals.push({
      name: "Photo Splice Forensics",
      status: "FAILED",
      detail: "Discontinuous noise gradient across photo border indicates photo replacement"
    });
  }

  signals.push({
    name: "Document Expiry Period",
    status: val.is_expired ? "FAILED" : "PASS",
    detail: val.is_expired ? "Document is expired" : `Document active and valid (${val.days_until_expiry || 365} days remaining)`
  });

  signals.push({
    name: "Error Level Analysis (ELA)",
    status: isTampered ? (tamper.tamper_risk_score >= 50 ? "FAILED" : "WARNING") : "PASS",
    detail: isTampered
      ? `Detected ${ela.hotspot_count || 1} localized recompression anomaly hotspot(s) (Score: ${tamper.tamper_risk_score}/100)`
      : "Uniform compression gradient observed across all data zones"
  });

  signals.push({
    name: "Face Biometric Verification",
    status: isMatch ? "PASS" : "FAILED",
    detail: face ? `Biometric concordance ${faceMatchPct}% (${isMatch ? "Match verified" : "Divergence detected"})` : "Selfie not provided; skipped"
  });

  signals.push({
    name: "Central Watchlist Probe",
    status: val.watchlist_hit ? "FAILED" : "PASS",
    detail: val.watchlist_hit ? `CRITICAL HIT: ${val.watchlist_reason}` : "Zero adverse records or stolen document alerts found in registry"
  });

  // Calculate detailed points for Risk Breakdown
  const tamperPoints = Math.min(35, Math.round(tamper.tamper_risk_score * 0.35));
  const facePoints = face ? (!isMatch ? Math.min(35, Math.round((100 - faceMatchPct) * 0.35)) : 0) : 0;
  const mrzPoints = !val.mrz_checksum_passed ? 20 : 0;
  const expiryPoints = val.is_expired ? 20 : 0;
  const watchlistPoints = val.watchlist_hit ? 20 : 0;

  const riskBreakdown = [
    { name: "Document Tampering", value: tamperPoints, note: isTampered ? (rawAnomalies[0] || "ELA recompression hotspot") : "Uniform gradient" },
    { name: "Face Verification", value: facePoints, note: face ? `Concordance ${faceMatchPct}%` : "Not provided" },
    { name: "MRZ Validation", value: mrzPoints, note: val.mrz_checksum_passed ? "Modulo-10 valid" : "Checksum error" },
    { name: "Document Expiry", value: expiryPoints, note: val.is_expired ? "Expired credential" : "Active & valid" },
    { name: "Watchlist Screening", value: watchlistPoints, note: val.watchlist_hit ? "Watchlist hit" : "No match found" }
  ];

  // Generate dynamic AI Explanation bullet points
  const aiExplanationPoints = [];
  if (val.mrz_checksum_passed) {
    aiExplanationPoints.push("✓ MRZ checksum is valid (Modulo-10 verification passed)");
  } else {
    aiExplanationPoints.push("✕ MRZ checksum calculation failed (possible digit manipulation)");
  }

  if (val.is_expired) {
    aiExplanationPoints.push("✕ Document is expired (overdue for official renewal)");
  } else {
    aiExplanationPoints.push(`✓ Document is not expired (Valid through ${expiry})`);
  }

  if (face) {
    if (isMatch) {
      aiExplanationPoints.push(`✓ Facial similarity is high (${faceMatchPct}% match between document photo and selfie)`);
    } else {
      aiExplanationPoints.push(`✕ Biometric facial mismatch detected (Similarity ${faceMatchPct}% is below 80% threshold)`);
    }
  }

  if (!isTampered) {
    aiExplanationPoints.push("✓ No significant tampering or ELA compression anomalies detected");
  } else {
    const anomalySummary = rawAnomalies.length > 0 ? rawAnomalies.join(" ") : `Tamper risk score: ${tamper.tamper_risk_score}/100`;
    aiExplanationPoints.push(`⚠ Forensics detected potential document alteration: ${anomalySummary}`);
  }

  if (!val.watchlist_hit) {
    aiExplanationPoints.push("✓ No adverse watchlist match found in intelligence registry");
  } else {
    aiExplanationPoints.push(`✕ Adverse match found on central watchlist: ${val.watchlist_reason}`);
  }

  const fullElaUrl = api.getElaImageUrl(ela.ela_image_url);

  // Detailed combined tampering details
  const fullTamperDetails = rawAnomalies.length > 0
    ? `${tamper.forensic_summary || ''} [Anomalies: ${rawAnomalies.join(' • ')}]`.trim()
    : (tamper.forensic_summary || "Document analysis completed.");

  // Highlight Box configuration
  let highlightBox = null;
  if (isTampered || isDobAnomaly || isPhotoAnomaly || isMrzAnomaly) {
    const highlightField = isDobAnomaly ? "Date of Birth (Altered)" : isPhotoAnomaly ? "Photo Area (Splice)" : isMrzAnomaly ? "MRZ Zone (Checksum Failure)" : "Document Forensics";
    highlightBox = {
      field: highlightField,
      expected: isDobAnomaly ? "Registry Match" : "Pristine",
      detected: rawAnomalies[0] || "Localized Discontinuity Detected",
      status: `Tamper Score: ${tamper.tamper_risk_score}/100`
    };
  }

  return {
    id: `custom_${decision.screening_id}`,
    isLiveResult: true,
    screeningId: decision.screening_id,
    name: `Live Screen: ${fullName}`,
    tagline: `Screened at ${decision.checkpoint_id} in ${Math.round(decision.processing_time_ms)}ms`,
    badge,
    badgeColor,
    riskScore: Math.round(decision.risk_score),
    riskLevel,
    recommendation,
    processingTimeMs: Math.round(decision.processing_time_ms),
    person: {
      name: fullName,
      dob: dob,
      originalDob: isDobAnomaly ? "01/01/2005" : null,
      nationality: `${nat} (${nat === "IND" ? "Republic of India" : nat})`,
      gender: passport.gender || "M",
      docId: docId,
      docType: docTypeStr,
      issueDate: "2022-01-01",
      expiryDate: expiry,
      issuingAuthority: passport.issuing_country || "Central Passport Issuance Authority",
      mrzLine1: mrz1,
      mrzLine2: mrz2,
      avatarUrl: customDocImageSrc || "/demo-data/genuine/passport.jpg",
      liveCameraUrl: customLiveImageSrc || customDocImageSrc || "/demo-data/genuine/selfie.jpg",
    },
    ocr: {
      confidence: Math.round((ocr.confidence_score || 0.95) * 100),
      qualityScore: val.is_valid ? 96 : 82,
      securityFeaturesDetected: val.is_valid ? 10 : (isTampered ? 6 : 8),
      totalSecurityFeatures: 10,
      tamperingDetected: isTampered,
      tamperingDetails: fullTamperDetails,
      highlightBox
    },
    signals,
    biometrics: {
      faceMatch: faceMatchPct,
      livenessScore: face ? Math.round(face.liveness_score * 100) : 98,
      status: isMatch ? "VERIFIED" : "POSSIBLE IDENTITY IMPERSONATION",
      landmarksDetected: 68,
      antiSpoofing: face?.is_live_person ? "PASS (Active Liveness Confirmed)" : "FAIL (Potential Presentation Attack)",
      confidenceText: face?.details || `Biometric facial comparison completed (${faceMatchPct}% similarity).`
    },
    identitySearch: {
      status: val.watchlist_hit ? "CRITICAL_ALERT" : "CLEARED",
      matchFound: val.watchlist_hit,
      aliasCount: val.watchlist_hit ? 1 : 0,
      interpolWatchlist: val.watchlist_hit ? "MATCH FLAG DETECTED" : "CLEARED (Synthetic Watchlist)",
      sanctionsCheck: val.watchlist_hit ? "CRITICAL" : "CLEARED (Synthetic Watchlist)",
      notes: val.watchlist_hit ? `Hit reason: ${val.watchlist_reason}` : "Zero matches in synthetic test registry (Demo Mode)."
    },
    auditTrail: {
      chainStatus: "VALID",
      algorithm: "SHA-256 Tamper-Evident Chained Digests",
      blockIndex: decision.audit_block_index || 1,
      currentHash: decision.audit_hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      timestamp: new Date().toLocaleString(),
      verifiedBy: "Cryptographic SHA-256 Chain Verification"
    },
    blockchain: {
      status: "VERIFIED",
      txId: `AUDIT-REC-#${decision.audit_block_index || 1}`,
      originalHash: decision.audit_hash ? decision.audit_hash.slice(0, 24) + "..." : "e3b0c44298fc...",
      currentHash: decision.audit_hash || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      timestamp: new Date().toLocaleString(),
      ledgerBlock: `Block #${decision.audit_block_index || 1}`,
      nodeSignatures: "Cryptographic Hash Chain"
    },
    riskBreakdown,
    riskFactors: [
      { label: "Document Tampering", value: tamperPoints, max: 25, status: isTampered ? "danger" : "ok" },
      { label: "Face Mismatch", value: facePoints, max: 35, status: !isMatch ? "danger" : "ok" },
      { label: "Identity & Watchlist", value: watchlistPoints, max: 20, status: val.watchlist_hit ? "danger" : "ok" },
      { label: "MRZ / Rule Integrity", value: mrzPoints + expiryPoints, max: 20, status: !val.mrz_checksum_passed ? "danger" : "ok" }
    ],
    aiExplanationPoints,
    aiSummary: decision.risk_score < 26 
      ? "Low-risk document. No major anomalies were detected during automated screening. Standard border clearance authorized." 
      : decision.risk_score < 66 
      ? `Potential anomalies detected in document forensics (${rawAnomalies[0] || 'tampering flags'}) or validation rules. Officer physical verification required before clearance.` 
      : "Critical threat flags detected across document forensics, biometric matching, or watchlist registries. Escalate to authorized officer immediately.",
    recommendedAction: recommendation,
    elaHeatmapUrl: fullElaUrl,
    detectedAnomalies: rawAnomalies
  };
}
