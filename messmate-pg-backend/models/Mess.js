import mongoose from "mongoose";
import Counter from "./Counter.js"; // ✅ Import counter

const messSchema = new mongoose.Schema(
  {
    mess_id: {
      type: Number,
      unique: true,
      required: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    menu: { type: Object, default: { items: [] } },
    price_range: String,
    rating: { type: Number, default: 0 },
    delivery_time: String,
    distance: String,
    offer: String,
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// ✅ Auto-increment mess_id using Counter collection
messSchema.pre("validate", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "mess_id" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // create if not exists
      );
      this.mess_id = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model("Mess", messSchema);
