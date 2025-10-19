import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mess_id: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true },
    items: [{ name: String, price: Number, quantity: Number }],
    total_price: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
