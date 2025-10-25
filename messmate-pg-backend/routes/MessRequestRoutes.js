import express from "express";
import path from "path";
import multer from "multer";
import MessRequest from "../models/MessRequest.js";
import Mess from "../models/Mess.js";
import { verifyToken } from "../middleware/auth.js"; // ✅ Correct import

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
  verifyToken,
  upload.fields([
    { name: "pancard", maxCount: 1 },
    { name: "fssai", maxCount: 1 },
    { name: "menuPhoto", maxCount: 1 },
    { name: "bankDetails", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        location,
        mobile,
        email,
        price_range,
        offer,
        menu,
      } = req.body;

      if (!name || !location || !mobile || !email || !menu) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let parsedMenu;
      try {
        parsedMenu = JSON.parse(menu);
        if (!Array.isArray(parsedMenu.items))
          throw new Error("Menu items missing");
      } catch (err) {
        console.error("Invalid menu JSON:", err.message);
        return res.status(400).json({ message: "Invalid menu format" });
      }

      // 🧾 File paths
      const pancardPath = req.files?.pancard?.[0]?.path || null;
      const fssaiPath = req.files?.fssai?.[0]?.path || null;
      const menuPhotoPath = req.files?.menuPhoto?.[0]?.path || null;
      const bankDetailsPath = req.files?.bankDetails?.[0]?.path || null;

      // ✅ Save mess request
      const messRequest = await MessRequest.create({
        name,
        location,
        mobile,
        email,
        price_range,
        offer,
        pancard: pancardPath,
        fssai: fssaiPath,
        menuPhoto: menuPhotoPath,
        bankDetails: bankDetailsPath,
        menu: {
          items: parsedMenu.items.map((i) => ({
            name: i.name,
            price: Number(i.price) || 0,
            image: i.image || "default-food.png",
            description: i.description || "Delicious homemade food",
            isVeg: i.isVeg ?? true,
          })),
        },
        owner_id: req.user.id, // ✅ use correct property
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
router.put("/:id/approve", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }

    const messRequest = await MessRequest.findById(req.params.id).populate(
      "owner_id",
      "name email"
    );

    if (!messRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!messRequest.menu?.items?.length) {
      return res
        .status(400)
        .json({ message: "No menu items found for this mess." });
    }

    // ✅ Create new mess
    const newMess = await Mess.create({
      name: messRequest.name,
      location: messRequest.location,
      menu: messRequest.menu,
      price_range: messRequest.price_range,
      offer: messRequest.offer,
      mobile: messRequest.mobile,
      email: messRequest.email,
      pancard: messRequest.pancard,
      fssai: messRequest.fssai,
      menuPhoto: messRequest.menuPhoto,
      bankDetails: messRequest.bankDetails,
      owner_id: messRequest.owner_id,
      rating: 0,
      delivery_time: "30–40 mins",
    });

    // ❌ Remove from request table
    await messRequest.deleteOne();

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
router.put("/:id/reject", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only." });
    }

    const messRequest = await MessRequest.findById(req.params.id);
    if (!messRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    await messRequest.deleteOne();

    res.status(200).json({
      success: true,
      message: "❌ Mess request rejected and removed from database.",
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
