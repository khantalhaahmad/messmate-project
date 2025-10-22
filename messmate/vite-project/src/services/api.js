// src/services/api.js
import axios from "axios";

// ============================================================
// 🌐 BACKEND URL CONFIGURATION (Auto-detect environment)
// ============================================================
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// ✅ Auto-select backend URL (add `/api` prefix automatically)
const BASE_URL = isLocalhost
  ? "http://localhost:4000/api" // 🧩 Local backend (with /api)
  : import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api` // 🛰️ Render backend (with /api)
  : "https://messmate-backend.onrender.com/api"; // fallback (with /api)

// ============================================================
// ⚙️ AXIOS INSTANCE SETUP
// ============================================================
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // ⏱ 15s timeout for safety
});

// ============================================================
// 🔐 ATTACH TOKEN TO EVERY REQUEST (if exists)
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// 🚨 GLOBAL ERROR HANDLER (Handle expired or invalid tokens)
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired → clear and redirect
    if (error.response?.status === 401) {
      console.warn("🔒 Session expired or invalid token. Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Log detailed info in development
    if (isLocalhost) {
      console.error("❌ API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// ============================================================
// 🧾 EXPORT INSTANCE
// ============================================================
export default api;
