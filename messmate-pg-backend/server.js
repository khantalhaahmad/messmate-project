// ============================================================
// 🚀 MESSMATE BACKEND SERVER
// ============================================================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// ============================================================
// 🧠 LOAD ENV & CONNECT DATABASE
// ============================================================
dotenv.config();
connectDB();

const app = express();

// ============================================================
// 📁 PATH & DIRECTORY SETUP
// ============================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads folder exists (auto-create if missing)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📂 'uploads' folder created automatically ✅");
}

// ============================================================
// 🌐 CORS CONFIGURATION
// ============================================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://messmate-frontendpart3.onrender.com", // ✅ production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================================================
// ⚙️ MIDDLEWARE
// ============================================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// ✅ Simple Logger
app.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.originalUrl}`);
  next();
});

// ============================================================
// 🚏 ROUTES
// ============================================================

// 🔐 Auth & Users
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";

// 🍽️ Mess & Orders
import messRoutes from "./routes/messRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messRequestRoutes from "./routes/MessRequestRoutes.js";

// 📊 Admin & Analytics
import recommendationRoutes from "./routes/recommendationRoutes.js";
import ownerStatsRoutes from "./routes/ownerStatsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminExtraRoutes from "./routes/adminExtraRoutes.js";

// 🚴 Delivery Module (New)
import deliveryRoutes from "./routes/deliveryRoutes.js"; // ✅ New Import

// 🧪 Testing
import testRoutes from "./routes/testRoutes.js";

// ✅ Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messes", messRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/mess-requests", messRequestRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/owner", ownerStatsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-extra", adminExtraRoutes);
app.use("/api/test", testRoutes);

// ✅ New Delivery Agent Routes
app.use("/api/admin", deliveryRoutes); // ⚡️ Mounted with same prefix for admin dashboard access

// ============================================================
// 🧠 GLOBAL ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack || err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy: Access denied." });
  }

  res.status(500).json({
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred.",
  });
});

// ============================================================
// 🩺 HEALTH CHECK ROUTE
// ============================================================
app.get("/", (req, res) => {
  res.send("✅ MessMate backend is running successfully!");
});

// ============================================================
// 🚀 START SERVER
// ============================================================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// 🧹 Graceful shutdown handler
process.on("SIGTERM", () => {
  console.log("🛑 Server shutting down...");
  process.exit(0);
});
