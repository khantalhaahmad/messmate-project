// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    mess_id: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodName: { type: String }, // ✅ Optional - to store food item name
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
