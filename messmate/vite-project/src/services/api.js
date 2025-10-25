// src/services/api.js
import axios from "axios";

// ============================================================
// 🌐 BACKEND URL CONFIGURATION (Auto-detect environment)
// ============================================================
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// ✅ Backend base URL
const BASE_URL = isLocalhost
  ? "http://localhost:4000/api" // 🧩 Local backend
  : import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api` // 🛰️ Render backend
  : "https://messmate-backend.onrender.com/api"; // fallback

// ============================================================
// ⚙️ AXIOS INSTANCE SETUP
// ============================================================
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // ⏱ 15 seconds
  withCredentials: false, // ⚠️ Keep false unless using cookies
});

// ============================================================
// 🔐 ATTACH TOKEN TO EVERY REQUEST
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
// 🚨 GLOBAL ERROR HANDLER
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔒 Session expired. Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

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

export default api;
