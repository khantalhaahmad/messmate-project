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

    // ✅ Prevent duplicate mess
    const existingMess = await Mess.findOne({ name: req.body.name });
    if (existingMess) {
      return res.status(400).json({ message: "Mess with this name already exists." });
    }

    // ✅ Auto-increment mess_id
    const lastMess = await Mess.findOne().sort({ mess_id: -1 });
    const newMessId = lastMess ? lastMess.mess_id + 1 : 1;

    const mess = await Mess.create({
      ...req.body,
      mess_id: newMessId,
      owner_id: req.user._id,
    });

    res.status(201).json({
      message: "✅ Mess created successfully",
      mess,
    });
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
    console.error("💥 Error fetching messes:", error);
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

    res.status(200).json(mess);
  } catch (error) {
    console.error("💥 Error fetching mess by mess_id:", error);
    res.status(500).json({ message: "Failed to fetch mess", error: error.message });
  }
});

/**
 * ============================================================
 * 🟠 Update Mess by mess_id (Owner or Admin)
 * ============================================================
 */
router.put("/id/:mess_id", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    if (req.user.role !== "admin" && mess.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "⚠️ Not authorized to update this mess." });
    }

    const updatedMess = await Mess.findOneAndUpdate(
      { mess_id: Number(req.params.mess_id) },
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "✅ Mess updated successfully",
      mess: updatedMess,
    });
  } catch (error) {
    console.error("💥 Error updating mess:", error);
    res.status(500).json({ message: "Failed to update mess", error: error.message });
  }
});

/**
 * ============================================================
 * 🔴 Delete Mess by mess_id (Owner or Admin)
 * ============================================================
 */
router.delete("/id/:mess_id", authMiddleware, async (req, res) => {
  try {
    const mess = await Mess.findOne({ mess_id: Number(req.params.mess_id) });
    if (!mess) return res.status(404).json({ message: "❌ Mess not found" });

    if (req.user.role !== "admin" && mess.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "⚠️ Not authorized to delete this mess." });
    }

    await Mess.deleteOne({ mess_id: Number(req.params.mess_id) });
    res.status(200).json({
      message: "🗑️ Mess deleted successfully",
      deletedId: req.params.mess_id,
    });
  } catch (error) {
    console.error("💥 Error deleting mess:", error);
    res.status(500).json({ message: "Failed to delete mess", error: error.message });
  }
});

export default router;
