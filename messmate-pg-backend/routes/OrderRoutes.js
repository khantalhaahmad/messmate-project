// routes/OrderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import Mess from "../models/Mess.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * ✅ POST /orders → Place an order (works for any mess)
 * Automatically enriches each item with type/category/image from Mess model
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { mess_id, mess_name, items } = req.body;

    console.log("📦 Incoming Order Request:", { userId, mess_id, mess_name, items });

    // 🧩 1️⃣ Validate input
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not logged in" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No food items provided." });
    }

    // 🧩 2️⃣ Calculate total price
    const total_price = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    // 🧩 3️⃣ Try finding the mess to pull menu details
    let mess = null;
    if (mess_id) mess = await Mess.findOne({ mess_id });

    // 🧩 4️⃣ Enrich order items with `type`, `category`, and `image`
    const updatedItems = items.map((item) => {
      let menuItem = null;

      if (mess && mess.menu) {
        if (Array.isArray(mess.menu.items)) {
          // Case: menu stored as { items: [...] }
          menuItem = mess.menu.items.find(
            (m) => m.name.toLowerCase() === item.name.toLowerCase()
          );
        } else if (Array.isArray(mess.menu)) {
          // Case: menu stored as array
          mess.menu.forEach((m) => {
            if (Array.isArray(m.items)) {
              const found = m.items.find(
                (x) => x.name.toLowerCase() === item.name.toLowerCase()
              );
              if (found) menuItem = found;
            }
          });
        }
      }

      return {
        ...item,
        type: menuItem?.type || (menuItem?.isVeg ? "veg" : "non-veg") || "veg",
        category: menuItem?.category || "other",
        image: item.image || menuItem?.image || "default.png",
      };
    });

    // 🧩 5️⃣ Save the order
    const newOrder = await Order.create({
      user_id: userId,
      mess_id: mess_id || mess?._id?.toString() || "N/A",
      mess_name: mess_name || mess?.name || "Unknown Mess",
      items: updatedItems,
      total_price,
      status: "confirmed",
    });

    console.log("✅ Order successfully saved:", newOrder._id);

    // 🧩 6️⃣ Return success response
    return res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (err) {
    console.error("💥 Order placement error:", err);
    res.status(500).json({
      message: "Failed to place order",
      error: err.message,
    });
  }
});

/**
 * 🟢 GET /orders/my-orders → Fetch all orders for logged-in user
 */
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await Order.find({ user_id: userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("💥 Error fetching orders:", err);
    res.status(500).json({
      message: "Error fetching orders",
      error: err.message,
    });
  }
});

export default router;
