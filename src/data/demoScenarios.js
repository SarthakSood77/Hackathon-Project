export const DEMO_SCENARIOS = {
  scenarioRohan: {
    id: "scenarioRohan",
    key: "rohan",
    name: "Enrolled Citizen — Rohan Arjun Verma",
    tagline: "Republic of India Official Biometric Passport",
    badge: "LOW RISK — VERIFIED",
    badgeColor: "emerald",
    riskScore: 8,
    riskLevel: "LOW RISK",
    recommendation: "CLEARED / LOW RISK",
    demoDocPath: "/demo-data/rohan_passport.jpg",
    demoSelfiePath: "/demo-data/rohan_selfie.jpg",
    person: {
      name: "Rohan Arjun Verma",
      dob: "15/05/1998",
      nationality: "IND (Republic of India)",
      gender: "Male",
      docId: "U1234567",
      docType: "Republic of India Passport",
      issueDate: "20/01/2024",
      expiryDate: "19/01/2034",
      issuingAuthority: "Regional Passport Office, Lucknow",
      mrzLine1: "P<INDVERMA<<ROHAN<ARJUN<<<<<<<<<<<<<<<<<<<<<<",
      mrzLine2: "U1234567<7IND9805157M3401194<<<<<<<<<<<<<<<08",
      avatarUrl: "/demo-data/rohan_passport.jpg",
      liveCameraUrl: "/demo-data/rohan_selfie.jpg",
    },
    ocr: {
      confidence: 99.5,
      qualityScore: 98,
      securityFeaturesDetected: 10,
      totalSecurityFeatures: 10,
      tamperingDetected: false,
      tamperingDetails: "Government emblem, Ashok Stambh, and microprint security elements verified.",
    },
    signals: [
      { name: "Document Authenticity", status: "PASS", detail: "Republic of India official biometric passport template verified" },
      { name: "OCR Extraction", status: "PASS", detail: "Confidence 99.5% across Visual Inspection Zone (VIZ)" },
      { name: "ICAO 9303 MRZ Checksums", status: "PASS", detail: "Modulo-10 check digits verified against Enrolled Citizen Registry" },
      { name: "Document Expiry Period", status: "PASS", detail: "Document active and valid through 19/01/2034" },
      { name: "Error Level Analysis (ELA)", status: "PASS", detail: "Uniform recompression gradient across portrait and data zones" },
      { name: "Face Biometric Verification", status: "PASS", detail: "Biometric concordance 95.4% (passing threshold: 80.0%)" },
      { name: "Central Watchlist Probe", status: "PASS", detail: "Zero adverse records or stolen document alerts found" }
    ],
    biometrics: {
      faceMatch: 95,
      livenessScore: 99,
      status: "VERIFIED",
      landmarksDetected: 68,
      antiSpoofing: "PASS (Natural 3D Depth & Presentation Check)",
      confidenceText: "High biometric concordance between passport photograph and live selfie (95.4% match)."
    },
    identitySearch: {
      status: "CLEARED",
      matchFound: false,
      aliasCount: 0,
      interpolWatchlist: "CLEARED",
      sanctionsCheck: "CLEARED",
      notes: "Enrolled in Government Citizen Registry. Zero adverse records."
    },
    blockchain: {
      status: "VERIFIED",
      txId: "AUDIT-REC-IND-U1234567",
      originalHash: "3b18c51592a66634a9febd1eb713c4c1f13e7787c7fef07eb147c6c2752dc589",
      currentHash: "3b18c51592a66634a9febd1eb713c4c1f13e7787c7fef07eb147c6c2752dc589",
      timestamp: new Date().toLocaleString(),
      ledgerBlock: "Block #104",
      nodeSignatures: "Cryptographic SHA-256 Chain"
    },
    riskBreakdown: [
      { name: "MRZ Integrity", value: 0 },
      { name: "Document Tampering", value: 4 },
      { name: "Face Verification", value: 0 },
      { name: "Document Validity", value: 0 },
      { name: "Watchlist Registry", value: 0 }
    ],
    riskFactors: [
      { label: "Document Tampering", value: 4, max: 35, status: "ok" },
      { label: "Face Mismatch", value: 0, max: 25, status: "ok" },
      { label: "Identity & Watchlist", value: 0, max: 15, status: "ok" },
      { label: "MRZ / Rule Integrity", value: 0, max: 25, status: "ok" }
    ],
    aiExplanationPoints: [
      "✓ Enrolled citizen record verified in Government Citizen Registry (Rohan Arjun Verma)",
      "✓ MRZ checksums and document number U1234567 validated",
      "✓ Document valid through 19/01/2034 (10-year validity)",
      "✓ Facial biometric concordance is 95.4% (passing threshold: 80.0%)",
      "✓ Error Level Analysis confirms uniform compression gradient without photo splicing",
      "✓ Zero adverse records or stolen document alerts found"
    ],
    aiSummary: "Genuine Republic of India biometric passport issued to Rohan Arjun Verma. All security features, biometric landmarks, and registry cross-checks fully verified. Automated e-Gate clearance authorized.",
    recommendedAction: "CLEARED / LOW RISK"
  },
  scenarioA: {
    id: "scenarioA",
    key: "genuine",
    name: "Scenario A: Verified Citizen — Parth Shandilya",
    tagline: "Standard Border Clearance — Genuine Synthetic Passport",
    badge: "LOW RISK — VERIFIED",
    badgeColor: "emerald",
    riskScore: 8,
    riskLevel: "LOW RISK",
    recommendation: "CLEARED / LOW RISK",
    demoDocPath: "/demo-data/parth_passport.jpg",
    demoSelfiePath: "/demo-data/parth_selfie.jpg",
    person: {
      name: "Parth Shandilya",
      dob: "01/01/2005",
      nationality: "DRM (Demo Republic)",
      gender: "Male",
      docId: "DEMO1234567",
      docType: "Standard Passport",
      issueDate: "01/01/2026",
      expiryDate: "01/01/2036",
      issuingAuthority: "Demo Republic Authority",
      mrzLine1: "P<DRMSHANDILYA<<PARTH<<<<<<<<<<<<<<<<<<<<<<<",
      mrzLine2: "DEMO1234567DRM0501017X3601012<<<<<<<<<<<<<<08",
      avatarUrl: "/demo-data/parth_passport.jpg",
      liveCameraUrl: "/demo-data/parth_selfie.jpg",
    },
    ocr: {
      confidence: 99.8,
      qualityScore: 99,
      securityFeaturesDetected: 10,
      totalSecurityFeatures: 10,
      tamperingDetected: false,
      tamperingDetails: "All microprint structures, typography, and optical security threads fully intact.",
    },
    signals: [
      { name: "Document Authenticity", status: "PASS", detail: "Official synthetic travel passport template structure conforms to standard" },
      { name: "OCR Extraction", status: "PASS", detail: "Confidence 99.2% across Visual Inspection Zone (VIZ)" },
      { name: "ICAO 9303 MRZ Checksums", status: "PASS", detail: "Modulo-10 check digits verified on Document Number, DOB, and Expiry" },
      { name: "Document Expiry Period", status: "PASS", detail: "Document active and valid (Expiry: 09/01/2031)" },
      { name: "Error Level Analysis (ELA)", status: "PASS", detail: "Uniform recompression gradient across all text zones and photo border" },
      { name: "Face Biometric Verification", status: "PASS", detail: "Biometric concordance 94.2% (above 80% passing threshold)" },
      { name: "Central Watchlist Probe", status: "PASS", detail: "Zero adverse records or stolen document alerts found in simulated registry" }
    ],
    biometrics: {
      faceMatch: 94,
      livenessScore: 99,
      status: "VERIFIED",
      landmarksDetected: 68,
      antiSpoofing: "PASS (Natural 3D Depth & Presentation Check)",
      confidenceText: "High biometric concordance between document portrait and live optical stream (94.2% match)."
    },
    identitySearch: {
      status: "CLEARED",
      matchFound: false,
      aliasCount: 0,
      interpolWatchlist: "CLEARED",
      sanctionsCheck: "CLEARED",
      notes: "No adverse cross-border travel flags or alias matches found in simulated registry."
    },
    blockchain: {
      status: "VERIFIED",
      txId: "DEMO-TX-440192-IND",
      originalHash: "8f3a9c7b21e05d9841f30129bc82e1719a820c897f25bb02e9",
      currentHash: "8f3a9c7b21e05d9841f30129bc82e1719a820c897f25bb02e9",
      timestamp: "31 Aug 2026, 21:30:15 IST",
      ledgerBlock: "#8,421,902",
      nodeSignatures: 12
    },
    riskBreakdown: [
      { name: "Document Tampering", value: 5, note: "Baseline sensor noise" },
      { name: "Face Verification", value: 0, note: "Match 94.2%" },
      { name: "MRZ Validation", value: 0, note: "Checksums valid" },
      { name: "Document Expiry", value: 0, note: "Valid until 2031" },
      { name: "Watchlist Screening", value: 0, note: "No match" }
    ],
    riskFactors: [
      { label: "Document Tampering", value: 5, max: 25, status: "ok" },
      { label: "Face Mismatch", value: 0, max: 35, status: "ok" },
      { label: "MRZ Validation", value: 0, max: 20, status: "ok" },
      { label: "Expiry / Watchlist", value: 0, max: 20, status: "ok" }
    ],
    aiExplanationPoints: [
      "✓ MRZ checksum is valid (Modulo-10 7-3-1 check digit match)",
      "✓ Document is not expired (Valid through 09/01/2031)",
      "✓ Facial similarity is high (94.2% match between document and live selfie)",
      "✓ No significant tampering or ELA compression anomalies detected",
      "✓ No adverse watchlist match found in simulated intelligence registry"
    ],
    aiSummary: "Low-risk document. No major anomalies were detected during automated screening. Standard border clearance authorized.",
    recommendedAction: "CLEARED / LOW RISK"
  },

  scenarioB: {
    id: "scenarioB",
    key: "tampered",
    name: "Scenario B: Tampered Document — Parth Shandilya",
    tagline: "DOB Alteration & Photo Slice Modification Detected",
    badge: "HIGH RISK / MANUAL REVIEW",
    badgeColor: "rose",
    riskScore: 68,
    riskLevel: "MANUAL REVIEW",
    recommendation: "SECONDARY INSPECTION REQUIRED",
    demoDocPath: "/demo-data/parth_tampered.jpg",
    demoSelfiePath: "/demo-data/parth_selfie.jpg",
    person: {
      name: "Parth Shandilya",
      dob: "15/12/2005",
      originalDob: "01/01/2005",
      nationality: "DRM (Demo Republic)",
      gender: "Male",
      docId: "DEMO1234567",
      docType: "Standard Passport",
      issueDate: "01/01/2026",
      expiryDate: "01/01/2036",
      issuingAuthority: "Demo Republic Authority",
      mrzLine1: "P<DRMSHANDILYA<<PARTH<<<<<<<<<<<<<<<<<<<<<<<",
      mrzLine2: "DEMO1234567DRM0512157X3601012<<<<<<<<<<<<<<08",
      avatarUrl: "/demo-data/parth_tampered.jpg",
      liveCameraUrl: "/demo-data/parth_selfie.jpg",
    },
    ocr: {
      confidence: 88.4,
      qualityScore: 78,
      securityFeaturesDetected: 6,
      totalSecurityFeatures: 10,
      tamperingDetected: true,
      tamperingDetails: "Visual ink alteration detected in Date of Birth zone ('15 DEC' over '01 JAN 2005') and horizontal seam discontinuity on portrait.",
      highlightBox: {
        top: "34%",
        left: "54%",
        width: "28%",
        height: "12%",
        label: "DOB ALTERATION (15 DEC 2005)"
      }
    },
    signals: [
      { name: "Document Authenticity", status: "WARNING", detail: "High-frequency noise gradient detected around birthdate zone" },
      { name: "OCR Extraction", status: "PASS", detail: "Confidence 97.4% across main text zones" },
      { name: "ICAO 9303 MRZ Checksums", status: "PASS", detail: "MRZ line matches modified visual layout" },
      { name: "Document Expiry Period", status: "PASS", detail: "Document active and valid (Expiry: 13/02/2030)" },
      { name: "Error Level Analysis (ELA)", status: "FAILED", detail: "High ELA anomaly score (65/100) — localized pixel edit around DOB" },
      { name: "Face Biometric Verification", status: "PASS", detail: "Biometric concordance 91.5% (Match verified)" },
      { name: "Central Watchlist Probe", status: "PASS", detail: "Zero adverse records found in simulated registry" }
    ],
    biometrics: {
      faceMatch: 91,
      livenessScore: 95,
      status: "VERIFIED",
      landmarksDetected: 68,
      antiSpoofing: "PASS (Active Liveness Confirmed)",
      confidenceText: "Biometric face match verified, however physical credentials exhibit signs of localized digital/photo alteration."
    },
    identitySearch: {
      status: "WARNING",
      matchFound: true,
      aliasCount: 1,
      interpolWatchlist: "CLEARED",
      sanctionsCheck: "CLEARED",
      notes: "Enrolled profile under DEMO-28470 indicates year of birth as 2002; physical card presents 1995 (7-year discrepancy)."
    },
    blockchain: {
      status: "FAILED",
      txId: "DEMO-TX-88291-MUM",
      originalHash: "8f3a9c7b508912de7a61d02334fca89812903e48bb912384a",
      currentHash: "2d7b91a4773829ab10c3f59220914e910283c74991823901b",
      timestamp: "31 Aug 2026, 21:15:42 IST",
      ledgerBlock: "#8,420,119",
      nodeSignatures: 12
    },
    riskBreakdown: [
      { name: "Document Tampering", value: 35, note: "ELA DOB hotspot detected" },
      { name: "Face Verification", value: 0, note: "Match 91.5%" },
      { name: "MRZ Validation", value: 0, note: "Checksum matched" },
      { name: "Document Expiry", value: 0, note: "Valid until 2030" },
      { name: "Watchlist Screening", value: 19, note: "Identity DOB discrepancy" }
    ],
    riskFactors: [
      { label: "Document Tampering", value: 25, max: 25, status: "danger" },
      { label: "Face Mismatch", value: 0, max: 35, status: "ok" },
      { label: "Identity Inconsistency", value: 15, max: 20, status: "warning" },
      { label: "MRZ / Rule Integrity", value: 14, max: 20, status: "warning" }
    ],
    aiExplanationPoints: [
      "⚠ Error Level Analysis (ELA) detected significant localized pixel recompression near Date of Birth",
      "⚠ Enrolled database hash indicates birth year 2002 while visual zone shows 1995",
      "✓ MRZ checksum computed cleanly on visual zone characters",
      "✓ Biometric facial comparison is concordant (91.5% match)",
      "✓ No international Interpol red notice flags found"
    ],
    aiSummary: "Potential tampering detected in Date of Birth field. Error Level Analysis indicates localized pixel editing. Physical document inspection by authorized officer required before clearance.",
    recommendedAction: "OFFICER VERIFICATION REQUIRED"
  },

  scenarioC: {
    id: "scenarioC",
    key: "expired",
    name: "Scenario C: Expired Document",
    tagline: "Document Validity Expired — Clearance Prohibited",
    badge: "MEDIUM RISK — EXPIRED CREDENTIAL",
    badgeColor: "amber",
    riskScore: 48,
    riskLevel: "MANUAL REVIEW",
    recommendation: "OFFICER VERIFICATION REQUIRED",
    demoDocPath: "/demo-data/expired/passport_expired.jpg",
    demoSelfiePath: "/demo-data/expired/selfie.jpg",
    person: {
      name: "Sunita Patel",
      dob: "20/11/1988",
      nationality: "IND (Republic of India)",
      gender: "Female",
      docId: "DEMO-28468",
      docType: "Standard Passport",
      issueDate: "15/05/2012",
      expiryDate: "14/05/2022",
      issuingAuthority: "Passport Office Ahmedabad",
      mrzLine1: "P<INDPATEL<<SUNITA<<<<<<<<<<<<<<<<<<<<<<<<<",
      mrzLine2: "DEMO284684IND8811201F2205146<<<<<<<<<<<<<<04",
      avatarUrl: "/demo-data/expired/passport_expired.jpg",
      liveCameraUrl: "/demo-data/expired/selfie.jpg",
    },
    ocr: {
      confidence: 98.8,
      qualityScore: 96,
      securityFeaturesDetected: 9,
      totalSecurityFeatures: 10,
      tamperingDetected: false,
      tamperingDetails: "Document structural integrity is intact, but the credential validity has lapsed.",
    },
    signals: [
      { name: "Document Authenticity", status: "PASS", detail: "Official government template and optical security threads intact" },
      { name: "OCR Extraction", status: "PASS", detail: "Confidence 98.8% across MRZ and Visual zones" },
      { name: "ICAO 9303 MRZ Checksums", status: "PASS", detail: "Modulo-10 check digits verified" },
      { name: "Document Expiry Period", status: "FAILED", detail: "Document expired on 14/05/2022 (Overdue for renewal)" },
      { name: "Error Level Analysis (ELA)", status: "PASS", detail: "No localized editing or photo replacement detected" },
      { name: "Face Biometric Verification", status: "PASS", detail: "Biometric concordance 93.0% (Match verified)" },
      { name: "Central Watchlist Probe", status: "PASS", detail: "Zero adverse flags in simulated intelligence registry" }
    ],
    biometrics: {
      faceMatch: 93,
      livenessScore: 98,
      status: "VERIFIED",
      landmarksDetected: 68,
      antiSpoofing: "PASS",
      confidenceText: "Biometric facial comparison matches document bearer (93.0%)."
    },
    identitySearch: {
      status: "CLEARED",
      matchFound: false,
      aliasCount: 0,
      interpolWatchlist: "CLEARED",
      sanctionsCheck: "CLEARED",
      notes: "Subject has no active watchlist matches."
    },
    blockchain: {
      status: "FAILED",
      txId: "DEMO-TX-10492-AHM",
      originalHash: "3f9a2b10928e47ac901823901bca8912448a910283c79a",
      currentHash: "3f9a2b10928e47ac901823901bca8912448a910283c79a",
      timestamp: "31 Aug 2026, 21:00:00 IST",
      ledgerBlock: "#8,418,900",
      nodeSignatures: 12
    },
    riskBreakdown: [
      { name: "Document Tampering", value: 0, note: "No tampering detected" },
      { name: "Face Verification", value: 0, note: "Match 93.0%" },
      { name: "MRZ Validation", value: 0, note: "Checksums valid" },
      { name: "Document Expiry", value: 45, note: "Document expired (2022)" },
      { name: "Watchlist Screening", value: 3, note: "Clear registry" }
    ],
    riskFactors: [
      { label: "Document Expiry", value: 20, max: 20, status: "danger" },
      { label: "Document Tampering", value: 0, max: 25, status: "ok" },
      { label: "Face Mismatch", value: 0, max: 35, status: "ok" },
      { label: "Identity Inconsistency", value: 28, max: 20, status: "warning" }
    ],
    aiExplanationPoints: [
      "✕ Document expiration date is in the past (Expired on 14/05/2022)",
      "✓ MRZ Modulo-10 checksum calculation passed",
      "✓ No physical or digital tampering detected on document surface",
      "✓ Facial biometric comparison verified bearer identity (93.0% match)",
      "✓ No adverse flags found on international watchlist registry"
    ],
    aiSummary: "Document is expired. Credential validity lapsed on 14/05/2022. Traveler must present an active, unexpired passport before clearance.",
    recommendedAction: "OFFICER VERIFICATION REQUIRED"
  },

  scenarioD: {
    id: "scenarioD",
    key: "mismatch",
    name: "Scenario D: Face Mismatch (Impersonation)",
    tagline: "Biometric Facial Divergence — Suspected Impersonation",
    badge: "HIGH RISK — POSSIBLE IDENTITY IMPERSONATION",
    badgeColor: "rose",
    riskScore: 86,
    riskLevel: "HIGH RISK",
    recommendation: "ESCALATE TO AUTHORIZED OFFICER",
    demoDocPath: "/demo-data/mismatch/passport.jpg",
    demoSelfiePath: "/demo-data/mismatch/different_selfie.jpg",
    person: {
      name: "Aman Verma",
      dob: "03/11/1990",
      nationality: "IND (Republic of India)",
      gender: "Male",
      docId: "DEMO-28469",
      docType: "Standard Passport",
      issueDate: "05/06/2023",
      expiryDate: "04/06/2028",
      issuingAuthority: "Consular Services Division",
      mrzLine1: "P<INDVERMA<<AMAN<<<<<<<<<<<<<<<<<<<<<<<<<<<",
      mrzLine2: "DEMO284693IND9011038M2806041<<<<<<<<<<<<<<89",
      avatarUrl: "/demo-data/mismatch/passport.jpg",
      liveCameraUrl: "/demo-data/mismatch/different_selfie.jpg",
    },
    ocr: {
      confidence: 96.8,
      qualityScore: 90,
      securityFeaturesDetected: 8,
      totalSecurityFeatures: 10,
      tamperingDetected: false,
      tamperingDetails: "Physical document structure is intact, but traveler in live camera feed fails biometric facial recognition.",
    },
    signals: [
      { name: "Document Authenticity", status: "PASS", detail: "Physical passport structure syntactically valid" },
      { name: "OCR Extraction", status: "PASS", detail: "Confidence 96.8% across all zones" },
      { name: "ICAO 9303 MRZ Checksums", status: "PASS", detail: "Modulo-10 check digits verified" },
      { name: "Document Expiry Period", status: "PASS", detail: "Document active and valid (Expiry: 04/06/2028)" },
      { name: "Error Level Analysis (ELA)", status: "PASS", detail: "No photo replacement or gradient tampering detected" },
      { name: "Face Biometric Verification", status: "FAILED", detail: "Severe biometric mismatch (Similarity: 27.4% vs 80% passing threshold)" },
      { name: "Central Watchlist Probe", status: "WARNING", detail: "Watchlist cross-probe flagged subject for alias investigation" }
    ],
    biometrics: {
      faceMatch: 27,
      livenessScore: 98,
      status: "POSSIBLE IDENTITY IMPERSONATION",
      landmarksDetected: 68,
      antiSpoofing: "PASS (Live Subject Present)",
      confidenceText: "CRITICAL MISMATCH: Facial geometry similarity score is only 27.4%, significantly below the 80% border passing threshold. Person presenting credential is not the document holder."
    },
    identitySearch: {
      status: "CRITICAL_ALERT",
      matchFound: true,
      aliasCount: 2,
      interpolWatchlist: "SUSPICIOUS MATCH FLAG",
      sanctionsCheck: "CLEARED",
      notes: "Subject camera embedding diverges from document photograph. Possible identity lending or lookalike fraud."
    },
    blockchain: {
      status: "FAILED",
      txId: "DEMO-TX-99304-DEL",
      originalHash: "9a2f1b88301824ef78019a823901bc0912448a910283c79a",
      currentHash: "1e4a9088192837bc01928347fa89012384a910839480182b",
      timestamp: "31 Aug 2026, 21:04:18 IST",
      ledgerBlock: "#8,419,840",
      nodeSignatures: 12
    },
    riskBreakdown: [
      { name: "Document Tampering", value: 0, note: "Document intact" },
      { name: "Face Verification", value: 55, note: "Severe Mismatch (27.4%)" },
      { name: "MRZ Validation", value: 0, note: "Checksums valid" },
      { name: "Document Expiry", value: 0, note: "Valid until 2028" },
      { name: "Watchlist Screening", value: 31, note: "Alias inquiry flag" }
    ],
    riskFactors: [
      { label: "Face Mismatch", value: 35, max: 35, status: "danger" },
      { label: "Identity Inconsistency", value: 20, max: 20, status: "danger" },
      { label: "Document Tampering", value: 0, max: 25, status: "ok" },
      { label: "MRZ / Rule Integrity", value: 31, max: 20, status: "danger" }
    ],
    aiExplanationPoints: [
      "✕ Critical facial biometric mismatch (Similarity score 27.4% is far below the 80% passing threshold)",
      "✕ Facial landmark geometry indicates traveler is an impersonator or lookalike",
      "✓ Physical document is authentic with valid MRZ checksums",
      "✓ Document is not expired (Valid through 04/06/2028)",
      "⚠ Escalation to supervisor required for secondary biometric isolation"
    ],
    aiSummary: "Multiple anomalies detected: Severe biometric divergence (27.4% face match). Traveler does not match passport portrait. Escalate to authorized officer for physical verification and biometric isolation.",
    recommendedAction: "ESCALATE TO AUTHORIZED OFFICER"
  }
};

