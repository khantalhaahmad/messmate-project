// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/auth.js";
import messRoutes from "./routes/messRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messRequestRoutes from "./routes/MessRequestRoutes.js";
import testRoutes from "./routes/testRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Dynamic CORS setup (works for localhost & Render)
const allowedOrigins = [
  "http://localhost:5173", // Local dev
  process.env.FRONTEND_URL, // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Parse incoming requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Request logger (helpful for debugging)
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Debug route
app.post("/test-body", (req, res) => {
  console.log("📦 Body received at /test-body:", req.body);
  res.json({ received: req.body });
});

// ✅ Register all routes
app.use("/auth", authRoutes);
app.use("/messes", messRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/users", userRoutes);
app.use("/mess-requests", messRequestRoutes);
app.use("/test", testRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ MessMate backend is running successfully!");
});

// ✅ Dynamic PORT (Render provides PORT automatically)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (${process.env.NODE_ENV || "development"} mode)`);
});
