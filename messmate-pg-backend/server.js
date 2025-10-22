import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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
// 🧭 PATH & DIR SETUP (for serving static files)
// ============================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ✅ Static file serving (for uploaded images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Simple Request Logger
app.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.originalUrl}`);
  next();
});

// ============================================================
// 🚏 ROUTES (All API endpoints prefixed with /api)
// ============================================================

// 🔐 Authentication & User Management
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";

// 🍽️ Mess & Order Management
import messRoutes from "./routes/messRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import messRequestRoutes from "./routes/MessRequestRoutes.js";

// 📊 Analytics & Admin Features
import recommendationRoutes from "./routes/recommendationRoutes.js";
import ownerStatsRoutes from "./routes/ownerStatsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // existing admin analytics
import adminExtraRoutes from "./routes/adminExtraRoutes.js"; // ✅ new extended admin APIs

// 🧪 Misc (Testing / Debug)
import testRoutes from "./routes/testRoutes.js";

// 🚀 Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messes", messRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/mess-requests", messRequestRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/owner", ownerStatsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-extra", adminExtraRoutes); // ✅ added here
app.use("/api/test", testRoutes);

// ============================================================
// 🧠 GLOBAL ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy: Access denied." });
  }

  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
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

// Graceful shutdown handler
process.on("SIGTERM", () => {
  console.log("🛑 Server shutting down...");
  process.exit(0);
});
