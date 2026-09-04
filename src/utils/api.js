/**
 * BorderGuard AI / IDShield AI - REST API Client
 * Connects React Frontend to FastAPI Backend at http://localhost:8000
 */

const API_BASE_URL = "https://sentinel-ai-backend-k4ar.onrender.com";

export const api = {
  /**
   * Health check to test if the Python FastAPI backend is running
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return { connected: false };
      const data = await res.json();
      return { connected: true, data };
    } catch (e) {
      return { connected: false, error: e.message };
    }
  },

  /**
   * Full 360-degree border document screening
   * @param {File|Blob} docFile - Document image
   * @param {File|Blob|null} liveFaceFile - Optional traveler live camera photo
   * @param {string} checkpointId - e.g. "GATE-04-DELHI-T3"
   * @param {string} officerId - e.g. "OFFICER-SHARMA"
   */
  async screenDocumentFull(docFile, liveFaceFile = null, checkpointId = "GATE-04-DELHI-T3", officerId = "OFFICER-SHARMA") {
    const formData = new FormData();
    formData.append("document_image", docFile, docFile.name || "document.jpg");
    if (liveFaceFile) {
      formData.append("live_face_image", liveFaceFile, liveFaceFile.name || "live_face.jpg");
    }
    formData.append("checkpoint_id", checkpointId);
    formData.append("officer_id", officerId);

    const res = await fetch(`${API_BASE_URL}/api/v1/screen/full`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Screening request failed" }));
      throw new Error(err.detail || err.message || "Screening failed");
    }

    const json = await res.json();
    return json.data;
  },

  /**
   * Standalone OCR extraction
   */
  async extractOCR(docFile) {
    const formData = new FormData();
    formData.append("document_image", docFile, docFile.name || "document.jpg");

    const res = await fetch(`${API_BASE_URL}/api/v1/ocr/extract`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("OCR extraction failed");
    const json = await res.json();
    return json.data;
  },

  /**
   * Standalone Tampering & ELA analysis
   */
  async analyzeTampering(docFile) {
    const formData = new FormData();
    formData.append("document_image", docFile, docFile.name || "document.jpg");

    const res = await fetch(`${API_BASE_URL}/api/v1/tampering/analyze`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Tamper analysis failed");
    const json = await res.json();
    return json.data;
  },

  /**
   * Standalone 1:1 facial biometric matching
   */
  async verifyFace(docFile, liveFaceFile) {
    const formData = new FormData();
    formData.append("document_image", docFile, docFile.name || "doc.jpg");
    formData.append("live_face_image", liveFaceFile, liveFaceFile.name || "live.jpg");

    const res = await fetch(`${API_BASE_URL}/api/v1/face/verify`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Face verification failed");
    const json = await res.json();
    return json.data;
  },

  /**
   * Check identity or document against Interpol / Watchlist
   */
  async checkWatchlist(query) {
    const res = await fetch(`${API_BASE_URL}/api/v1/watchlist/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    if (!res.ok) throw new Error("Watchlist check failed");
    const json = await res.json();
    return json.data;
  },

  /**
   * Get all watchlist items
   */
  async getWatchlist() {
    const res = await fetch(`${API_BASE_URL}/api/v1/watchlist`);
    if (!res.ok) throw new Error("Failed to fetch watchlist");
    const json = await res.json();
    return json.data;
  },

  /**
   * Add a new watchlist entry
   */
  async addWatchlistEntry(entry) {
    const res = await fetch(`${API_BASE_URL}/api/v1/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error("Failed to create watchlist entry");
    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch live dashboard KPIs and analytics
   */
  async getAnalyticsDashboard() {
    const res = await fetch(`${API_BASE_URL}/api/v1/analytics/dashboard`);
    if (!res.ok) throw new Error("Failed to fetch dashboard analytics");
    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch screening audit records
   */
  async getScreeningRecords(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/api/v1/screen/records?${query}`);
    if (!res.ok) throw new Error("Failed to fetch screening records");
    const json = await res.json();
    return json.data;
  },

  /**
   * Helper to format backend ELA heatmap image URL
   */
  getElaImageUrl(relativeUrl) {
    if (!relativeUrl) return null;
    if (relativeUrl.startsWith("http")) return relativeUrl;
    return `${API_BASE_URL}${relativeUrl}`;
  },
};
