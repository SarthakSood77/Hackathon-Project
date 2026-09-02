export const MOCK_ANALYTICS = {
  kpis: {
    dailyScreenings: 1248,
    avgProcessingTime: "1.8 sec",
    detectionRate: "99.4%",
    manualReviewRate: "3.2%",
    totalEnrolledDocs: "4,821,090",
    activeCheckpoints: 18,
    blockchainIntegrityScore: "99.98%"
  },
  hourlyThroughput: [
    { hour: "14:00", verified: 85, suspicious: 6, highRisk: 2 },
    { hour: "15:00", verified: 92, suspicious: 9, highRisk: 3 },
    { hour: "16:00", verified: 110, suspicious: 12, highRisk: 4 },
    { hour: "17:00", verified: 135, suspicious: 14, highRisk: 5 },
    { hour: "18:00", verified: 148, suspicious: 18, highRisk: 6 },
    { hour: "19:00", verified: 120, suspicious: 10, highRisk: 3 },
    { hour: "20:00", verified: 98, suspicious: 8, highRisk: 4 },
    { hour: "21:00", verified: 78, suspicious: 7, highRisk: 2 }
  ],
  docTypeDistribution: [
    { type: "Standard Passport", count: 820, percentage: "65.7%", color: "#38bdf8" },
    { type: "Diplomatic Passport", count: 84, percentage: "6.7%", color: "#818cf8" },
    { type: "E-Visa / Business", count: 260, percentage: "20.8%", color: "#06b6d4" },
    { type: "Emergency Certificate", count: 84, percentage: "6.8%", color: "#f59e0b" }
  ],
  riskDistribution: [
    { range: "0 - 15 (Low / Auto-Clear)", count: 1086, color: "#10b981", percent: 87 },
    { range: "16 - 50 (Moderate / Standard)", count: 82, color: "#0ea5e9", percent: 6.5 },
    { range: "51 - 75 (Suspicious / Manual Review)", count: 35, color: "#f59e0b", percent: 2.8 },
    { range: "76 - 100 (Critical High Risk)", count: 45, color: "#ef4444", percent: 3.6 }
  ],
  topThreatTriggers: [
    { name: "Cryptographic Hash Mismatch", count: 28, trend: "+12%" },
    { name: "Biometric Facial Divergence (<80%)", count: 24, trend: "-4%" },
    { name: "Date of Birth / Field Alteration", count: 19, trend: "+8%" },
    { name: "MRZ Formatting / Checksum Anomaly", count: 14, trend: "-15%" },
    { name: "Synthetic Photo Splicing Artifacts", count: 9, trend: "+2%" }
  ]
};
