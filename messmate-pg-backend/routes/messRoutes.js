// routes/messRoutes.js
import express from "express";
import Mess from "../models/Mess.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

/**
 * ============================================================
 * 🟢 Create a Mess (Owner Only)
 * ============================================================
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can add messes." });
    }

    const existingMess = await Mess.findOne({ name: req.body.name });
    if (existingMess) {
      return res.status(400).json({ message: "Mess with this name already exists." });
    }

    const lastMess = await Mess.findOne().sort({ mess_id: -1 });
    const newMessId = lastMess ? lastMess.mess_id + 1 : 1;

    const mess = await Mess.create({
      ...req.body,
      mess_id: newMessId,
      owner_id: req.user._id,
    });

    res.status(201).json({ message: "✅ Mess created successfully", mess });
  } catch (error) {
    console.error("💥 Error creating mess:", error);
    res.status(500).json({ message: "Failed to create mess", error: error.message });
  }
});

/**
 * ============================================================
 * 🟡 Get All Messes (Public)
 * ============================================================
 */
router.get("/", async (req, res) => {
  try {
    const messes = await Mess.find().sort({ mess_id: 1 });
    if (!messes.length) {
      return res.status(404).json({ message: "No messes found" });
    }

    res.status(200).json(messes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messes", error: error.message });
  }
});

/**
 * ============================================================
 * 🔵 Get Mess by Numeric mess_id
 * ============================================================
 */
router.get("/id/:mess_id", async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    // ✅ Return as-is (menu.items stays intact)
    res.status(200).json(mess);
  } catch (error) {
    console.error("💥 Error fetching mess by mess_id:", error);
    res.status(500).json({ message: "Failed to fetch mess", error: error.message });
  }
});

/**
 * ============================================================
 * 🍽️ Add Menu Item (Owner/Admin)
 * ============================================================
 */
router.post("/id/:mess_id/menu", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    if (
      req.user.role !== "admin" &&
      mess.owner_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "⚠️ Not authorized to add menu items." });
    }

    const newItem = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description || "",
      isVeg: req.body.isVeg,
    };

    // ✅ Always push into menu.items
    if (!mess.menu || !Array.isArray(mess.menu.items)) {
      mess.menu = { items: [] };
    }
    mess.menu.items.push(newItem);

    await mess.save();

    res.status(201).json({
      message: "✅ Menu item added successfully",
      menu: mess.menu.items,
    });
  } catch (error) {
    console.error("💥 Error adding menu item:", error);
    res.status(500).json({ message: "Failed to add menu item", error: error.message });
  }
});

/**
 * ============================================================
 * 🗑️ Delete Menu Item (Owner/Admin)
 * ============================================================
 */
router.delete("/id/:mess_id/menu/:itemIndex", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    if (
      req.user.role !== "admin" &&
      mess.owner_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "⚠️ Not authorized to delete menu items." });
    }

    if (!mess.menu?.items || !mess.menu.items.length) {
      return res.status(400).json({ message: "No menu items to delete." });
    }

    mess.menu.items.splice(req.params.itemIndex, 1);
    await mess.save();

    res.status(200).json({
      message: "🗑️ Menu item deleted successfully",
      menu: mess.menu.items,
    });
  } catch (error) {
    console.error("💥 Error deleting menu item:", error);
    res.status(500).json({ message: "Failed to delete menu item", error: error.message });
  }
});

export default router;
