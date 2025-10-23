import express from "express";
import path from "path";
import multer from "multer";
import MessRequest from "../models/MessRequest.js";
import Mess from "../models/Mess.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

/* ==============================================
   🖼️ MULTER STORAGE
   ============================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ==============================================
   ✅ SUBMIT NEW MESS REQUEST
   ============================================== */
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "pancard", maxCount: 1 },
    { name: "menuPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, location, mobile, email, price_range, offer, menu } = req.body;

      if (!name || !location || !mobile || !email || !menu)
        return res.status(400).json({ message: "Missing required fields" });

      let parsedMenu;
      try {
        parsedMenu = JSON.parse(menu);
        if (!Array.isArray(parsedMenu.items)) throw new Error("Menu items missing");
      } catch (err) {
        console.error("Invalid menu JSON:", err.message);
        return res.status(400).json({ message: "Invalid menu format" });
      }

      const pancardPath = req.files?.pancard?.[0]?.path || null;
      const menuPhotoPath = req.files?.menuPhoto?.[0]?.path || null;

      // ✅ Save request in same structure as real Messes
      const messRequest = await MessRequest.create({
        name,
        location,
        mobile,
        email,
        price_range,
        offer,
        pancard: pancardPath,
        menuPhoto: menuPhotoPath,
        menu: {
          items: parsedMenu.items.map((i) => ({
            name: i.name,
            price: Number(i.price) || 0,
            image: i.image || "default-food.png",
            description: i.description || "Delicious homemade food",
            isVeg: i.isVeg ?? true,
          })),
        },
        owner_id: req.user._id,
        status: "pending",
      });

      res.status(201).json({
        success: true,
        message: "✅ Mess request submitted successfully!",
        messRequest,
      });
    } catch (error) {
      console.error("💥 Error submitting mess request:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit mess request.",
        error: error.message,
      });
    }
  }
);

/* ==============================================
   ✅ APPROVE REQUEST
   ============================================== */
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only." });

    const messRequest = await MessRequest.findById(req.params.id).populate("owner_id", "name email");
    if (!messRequest)
      return res.status(404).json({ message: "Request not found" });

    if (!messRequest.menu?.items?.length)
      return res.status(400).json({ message: "No menu items found for this mess." });

    const newMess = await Mess.create({
      name: messRequest.name,
      location: messRequest.location,
      menu: messRequest.menu,
      price_range: messRequest.price_range,
      offer: messRequest.offer,
      mobile: messRequest.mobile,
      email: messRequest.email,
      pancard: messRequest.pancard,
      menuPhoto: messRequest.menuPhoto,
      owner_id: messRequest.owner_id,
      rating: 0,
      delivery_time: "30–40 mins",
    });

    messRequest.status = "approved";
    await messRequest.save();

    res.status(200).json({
      success: true,
      message: "✅ Mess approved and added successfully!",
      mess: newMess,
    });
  } catch (error) {
    console.error("💥 Error approving mess:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve mess request.",
      error: error.message,
    });
  }
});

/* ==============================================
   ❌ REJECT REQUEST
   ============================================== */
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only." });

    const messRequest = await MessRequest.findById(req.params.id);
    if (!messRequest)
      return res.status(404).json({ message: "Request not found" });

    messRequest.status = "rejected";
    messRequest.reason = req.body.reason || "Rejected by admin";
    await messRequest.save();

    res.status(200).json({
      success: true,
      message: "❌ Mess request rejected successfully.",
      messRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject request",
      error: error.message,
    });
  }
});

export default router;
