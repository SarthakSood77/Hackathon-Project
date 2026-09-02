export const INITIAL_ALERTS = [
  {
    id: "ALT-8091",
    severity: "CRITICAL",
    category: "Critical",
    title: "Possible Identity Impersonation",
    description: "Face similarity score 27% below threshold (80%). Subject embedding closely matches watchlisted alias record DEMO-17382.",
    docId: "DEMO-28469",
    personName: "Aman Verma",
    timestamp: "31 Aug 2026, 21:31:04",
    checkpoint: "Delhi Terminal 3 - Gate 04",
    status: "INVESTIGATING",
    actionTaken: "Biometric secondary isolation initiated"
  },
  {
    id: "ALT-8090",
    severity: "HIGH",
    category: "High Risk",
    title: "Document Integrity Ledger Failure",
    description: "Uploaded document hash (2d7b91a4...) differs from enrolled SHA-256 baseline (8f3a9c7b...). Physical alteration suspected.",
    docId: "DEMO-28470",
    personName: "Arjun Mehta",
    timestamp: "31 Aug 2026, 21:38:12",
    checkpoint: "Delhi Terminal 3 - Gate 04",
    status: "OPEN",
    actionTaken: "Flagged for Physical UV/IR Inspection"
  },
  {
    id: "ALT-8089",
    severity: "WARNING",
    category: "Suspicious",
    title: "Date of Birth Inconsistency Detected",
    description: "Extracted visual DOB (15/08/1995) differs from central passport database enrollment (15/08/2002).",
    docId: "DEMO-28470",
    personName: "Arjun Mehta",
    timestamp: "31 Aug 2026, 21:38:12",
    checkpoint: "Delhi Terminal 3 - Gate 04",
    status: "OPEN",
    actionTaken: "Awaiting Officer Disposition"
  },
  {
    id: "ALT-8088",
    severity: "CRITICAL",
    category: "Critical",
    title: "MRZ Checksum Digit Failure",
    description: "Line 2 character 28 checksum failed verification against encoded passport serial algorithm.",
    docId: "DEMO-28466",
    personName: "Tariq Mansoor",
    timestamp: "31 Aug 2026, 21:05:40",
    checkpoint: "Delhi Terminal 3 - Gate 01",
    status: "RESOLVED",
    actionTaken: "Manual passport reader scan completed. Cleared."
  },
  {
    id: "ALT-8087",
    severity: "SUSPICIOUS",
    category: "Suspicious",
    title: "High-Frequency Pixel Noise in Portrait Zone",
    description: "Spatial frequency analysis detected synthetic blurring around photo border indicative of physical photo-swap.",
    docId: "DEMO-28464",
    personName: "Elena Rostova",
    timestamp: "31 Aug 2026, 20:41:19",
    checkpoint: "Delhi Terminal 3 - Gate 03",
    status: "RESOLVED",
    actionTaken: "High-res optical sensor rescan passed with zero noise."
  }
];
