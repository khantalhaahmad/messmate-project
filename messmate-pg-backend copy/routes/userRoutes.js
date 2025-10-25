import express from "express";
import User from "../models/User.js";
import Mess from "../models/Mess.js";
import Order from "../models/Order.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

// ✅ Get User Profile
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let extraData = {};
    if (user.role === "owner") {
      extraData.messes = await Mess.find({ owner_id: user._id });
    } else if (user.role === "student") {
      extraData.orders = await Order.find({ user_id: user._id });
    }

    res.status(200).json({ user, ...extraData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

export default router;
