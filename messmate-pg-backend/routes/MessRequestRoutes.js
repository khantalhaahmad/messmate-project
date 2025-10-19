import express from "express";
import MessRequest from "../models/MessRequest.js";
import Mess from "../models/Mess.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

/**
 * ✅ Submit a new mess request (Owner or Student)
 * POST /mess-requests
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, location, menu, price_range, offer } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required." });
    }

    const messRequest = await MessRequest.create({
      name,
      location,
      menu,
      price_range,
      offer,
      owner_id: req.user.id,
      status: "pending",
    });

    res.status(201).json({
      message: "✅ Mess request submitted successfully. Awaiting admin approval.",
      messRequest,
    });
  } catch (error) {
    console.error("💥 Error submitting mess request:", error);
    res.status(500).json({ message: "Failed to submit request", error: error.message });
  }
});

/**
 * ✅ Get all mess requests (Admin only)
 * GET /mess-requests
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const requests = await MessRequest.find().populate("owner_id", "name email role");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mess requests", error: error.message });
  }
});

/**
 * ✅ Approve a mess request (Admin only)
 * PUT /mess-requests/:id/approve
 */
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const messRequest = await MessRequest.findById(req.params.id);
    if (!messRequest) return res.status(404).json({ message: "Mess request not found." });

    // Move the approved request to Mess collection
    const newMess = await Mess.create({
      name: messRequest.name,
      location: messRequest.location,
      menu: messRequest.menu,
      price_range: messRequest.price_range,
      offer: messRequest.offer,
      owner_id: messRequest.owner_id,
    });

    // Update request status
    messRequest.status = "approved";
    await messRequest.save();

    res.status(200).json({
      message: "✅ Mess request approved and added successfully.",
      newMess,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve request", error: error.message });
  }
});

/**
 * ❌ Reject a mess request (Admin only)
 * PUT /mess-requests/:id/reject
 */
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const messRequest = await MessRequest.findById(req.params.id);
    if (!messRequest) return res.status(404).json({ message: "Mess request not found." });

    messRequest.status = "rejected";
    messRequest.reason = req.body.reason || "Rejected by admin.";
    await messRequest.save();

    res.status(200).json({ message: "❌ Mess request rejected successfully.", messRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject request", error: error.message });
  }
});

export default router;
