// src/services/api.js
import axios from "axios";

// ✅ Detect backend URL automatically
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000", // fallback to local
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to every request (for authentication)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
