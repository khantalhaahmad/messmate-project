// models/Mess.js
import mongoose from "mongoose";
import Counter from "./Counter.js"; // ✅ Import counter

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  isVeg: { type: Boolean, default: true },
});

const messSchema = new mongoose.Schema(
  {
    mess_id: {
      type: Number,
      unique: true,
      required: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    menu: [menuItemSchema], // ✅ Array of menu items
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
        { new: true, upsert: true }
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
