// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ 1. Check Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ 2. Extract Token
    const token = authHeader.split(" ")[1];

    // ✅ 3. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 4. Find User by ID from Token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 5. Attach User to Request
    req.user = user;

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
