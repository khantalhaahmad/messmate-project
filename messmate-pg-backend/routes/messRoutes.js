// routes/messRoutes.js
import express from "express";
import Mess from "../models/Mess.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

/**
 * 🟢 CREATE: Add a new mess (for owner)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user._id;

    // ✅ Handle both menu: [ ... ] and menu: { items: [...] }
    const formattedMenu = Array.isArray(req.body.menu)
      ? { items: req.body.menu }
      : req.body.menu || { items: [] };

    const newMess = new Mess({
      name: req.body.name,
      location: req.body.location,
      price_range: req.body.price_range,
      rating: req.body.rating || 0,
      delivery_time: req.body.delivery_time,
      distance: req.body.distance,
      offer: req.body.offer,
      owner_id: ownerId,
      menu: formattedMenu,
    });

    await newMess.save();

    res.status(201).json({
      message: "✅ Mess created successfully",
      mess: newMess,
    });
  } catch (error) {
    console.error("💥 Error creating mess:", error);
    res.status(500).json({ message: "Failed to create mess", error: error.message });
  }
});

/**
 * 🟡 GET: All Messes
 */
router.get("/", async (req, res) => {
  try {
    const messes = await Mess.find().sort({ mess_id: 1 });

    const formattedMesses = messes.map((mess) => {
      const obj = mess.toObject();
      const menuItems = Array.isArray(obj.menu?.items) ? obj.menu.items : [];
      return { ...obj, menu: { items: menuItems } };
    });

    res.status(200).json(formattedMesses);
  } catch (error) {
    console.error("💥 Error fetching messes:", error);
    res.status(500).json({ message: "Failed to fetch messes", error: error.message });
  }
});

/**
 * 🔵 GET: Single Mess by mess_id
 */
router.get("/:mess_id", async (req, res) => {
  try {
    console.log("📦 Fetching mess with ID:", req.params.mess_id);
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    const obj = mess.toObject();
    const menuItems = Array.isArray(obj.menu?.items) ? obj.menu.items : [];

    res.status(200).json({ ...obj, menu: { items: menuItems } });
  } catch (error) {
    console.error("💥 Error fetching mess:", error);
    res.status(500).json({ message: "Failed to fetch mess", error: error.message });
  }
});

/**
 * 🍽️ POST: Add a single menu item
 */
router.post("/:mess_id/menu", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    if (
      req.user.role !== "admin" &&
      mess.owner_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "⚠️ Not authorized" });
    }

    const newItem = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description || "",
      isVeg: req.body.isVeg ?? true,
    };

    if (!mess.menu) mess.menu = { items: [] };
    mess.menu.items.push(newItem);

    await mess.save();

    res.status(201).json({
      message: "✅ Menu item added successfully",
      menu: mess.menu,
    });
  } catch (error) {
    console.error("💥 Error adding menu item:", error);
    res.status(500).json({ message: "Failed to add menu item", error: error.message });
  }
});

/**
 * ✏️ PUT: Replace all menu items
 */
router.put("/:mess_id/menu", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    if (
      req.user.role !== "admin" &&
      mess.owner_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "⚠️ Not authorized" });
    }

    const itemsArray = Array.isArray(req.body.menu)
      ? req.body.menu
      : Array.isArray(req.body.menu?.items)
      ? req.body.menu.items
      : null;

    if (!itemsArray) {
      return res.status(400).json({
        message:
          "⚠️ Invalid format — send either { menu: [ ... ] } or { menu: { items: [ ... ] } }",
      });
    }

    mess.menu = { items: itemsArray };
    await mess.save();

    res.status(200).json({
      message: "✅ Menu updated successfully",
      menu: mess.menu,
    });
  } catch (error) {
    console.error("💥 Error updating menu:", error);
    res.status(500).json({ message: "Failed to update menu", error: error.message });
  }
});

/**
 * 🗑️ DELETE: Remove one menu item by index
 */
router.delete("/:mess_id/menu/:index", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    const index = Number(req.params.index);
    if (!mess.menu?.items || index < 0 || index >= mess.menu.items.length)
      return res.status(404).json({ message: "❌ Menu item not found" });

    mess.menu.items.splice(index, 1);
    await mess.save();

    res.status(200).json({
      message: "🗑️ Menu item deleted successfully",
      menu: mess.menu,
    });
  } catch (error) {
    console.error("💥 Error deleting menu item:", error);
    res.status(500).json({ message: "Failed to delete menu item", error: error.message });
  }
});

/**
 * 🚮 DELETE: Delete entire mess by mess_id
 */
router.delete("/:mess_id", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    if (
      req.user.role !== "admin" &&
      mess.owner_id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "⚠️ Not authorized to delete this mess" });
    }

    await Mess.deleteOne({ mess_id: Number(req.params.mess_id) });
    res.status(200).json({ message: "🗑️ Mess deleted successfully" });
  } catch (error) {
    console.error("💥 Error deleting mess:", error);
    res.status(500).json({ message: "Failed to delete mess", error: error.message });
  }
});

export default router;
