import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

// ✅ Create Order
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student")
      return res.status(403).json({ message: "Only students can place orders" });

    const newOrder = await Order.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
});

// ✅ Get all orders (filtered by role)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.user.role === "owner") {
      orders = await Order.find().populate("mess_id").populate("user_id");
    } else {
      orders = await Order.find({ user_id: req.user.id }).populate("mess_id");
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

export default router;
