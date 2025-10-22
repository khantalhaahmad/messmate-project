// middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * ============================================================
 * 🔐 verifyToken Middleware (Stable for ESM)
 * ============================================================
 * - Uses named export so you can import { verifyToken } anywhere.
 * - Works perfectly with your /auth routes.
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Access denied. Token missing." });
    }

    // 🔍 Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧩 Normalize payload
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role,
      name: decoded.name || "Unknown",
    };

    console.log("✅ Verified user:", req.user);
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
