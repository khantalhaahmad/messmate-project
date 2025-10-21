import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import "./index.css"; // ✅ Ensure global styles are loaded
import { Toaster } from "react-hot-toast"; // ✅ Toast notifications

// ✅ Create React Root
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* ✅ Global Toast Notification Provider */}
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "10px",
          fontSize: "15px",
        },
        success: {
          style: { background: "#16a34a" }, // green
        },
        error: {
          style: { background: "#dc2626" }, // red
        },
      }}
    />
  </React.StrictMode>
);
