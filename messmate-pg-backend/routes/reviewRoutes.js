import express from "express";
import Review from "../models/Review.js";
import Mess from "../models/Mess.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

// ✅ Add Review
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student")
      return res.status(403).json({ message: "Only students can review" });

    const review = await Review.create({ ...req.body, user_id: req.user.id });

    // update mess average rating
    const reviews = await Review.find({ mess_id: req.body.mess_id });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Mess.findByIdAndUpdate(req.body.mess_id, { rating: avgRating });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
});

// ✅ Get Reviews for a mess
router.get("/:messId", async (req, res) => {
  try {
    const reviews = await Review.find({ mess_id: req.params.messId }).populate("user_id");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
});

export default router;
