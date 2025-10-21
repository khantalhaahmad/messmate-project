// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js"; // ✅ Import middleware

const router = express.Router();

/**
 * ============================================================
 * 🟢 REGISTER (Signup)
 * ============================================================
 */
router.post("/register", async (req, res) => {
  console.log("📩 Signup body:", req.body);
  try {
    const { name, email, password, role } = req.body;

    // ✅ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please login instead." });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Send response
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("💥 Signup Error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

/**
 * ============================================================
 * 🟡 LOGIN (supports email or username)
 * ============================================================
 */
router.post("/login", async (req, res) => {
  console.log("📩 Login route hit!");
  console.log("📦 Received body:", req.body);

  try {
    const { identifier, password } = req.body;

    // ✅ Validate input
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email/Username and password are required" });
    }

    // ✅ Find user by email OR name
    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register first." });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Successful login response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("💥 Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

/**
 * ============================================================
 * 🔐 VERIFY TOKEN (Protected Route)
 * ============================================================
 * Used to check if JWT token is valid and return user info
 */
router.get("/verify", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Token valid", user });
  } catch (error) {
    console.error("💥 Token Verification Error:", error);
    res.status(500).json({ message: "Token verification failed" });
  }
});

export default router;
