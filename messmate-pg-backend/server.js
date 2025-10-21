// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// ✅ Import routes
import authRoutes from "./routes/auth.js";
import messRoutes from "./routes/messRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messRequestRoutes from "./routes/MessRequestRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ============================================================
// 🌐 CORS CONFIGURATION
// ============================================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://messmate-frontendpart3.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
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

// ✅ Request logger
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================================
// 🚏 ROUTES
// ============================================================
app.use("/auth", authRoutes);
app.use("/messes", messRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/users", userRoutes);
app.use("/mess-requests", messRequestRoutes);
app.use("/test", testRoutes);
app.use("/api/recommendations", recommendationRoutes); // ✅ AI Recommendations

// ============================================================
// 🧠 ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.message);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy: Access denied." });
  }
  res.status(500).json({ message: "Server Error", error: err.message });
});

// ============================================================
// 🩺 HEALTH CHECK
// ============================================================
app.get("/", (req, res) => {
  res.send("✅ MessMate backend is running successfully!");
});

// ============================================================
// 🚀 START SERVER
// ============================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

process.on("SIGTERM", () => {
  console.log("🛑 Server shutting down...");
  process.exit(0);
});
