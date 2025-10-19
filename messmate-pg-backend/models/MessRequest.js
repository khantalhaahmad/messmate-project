import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const messRequestSchema = new mongoose.Schema(
  {
    request_id: { type: Number, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    menu: { type: Object, default: { items: [] } },
    price_range: String,
    offer: String,
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Add Auto-Increment Plugin
const AutoIncrement = AutoIncrementFactory(mongoose);
messRequestSchema.plugin(AutoIncrement, { inc_field: "request_id" });

const MessRequest = mongoose.model("MessRequest", messRequestSchema);
export default MessRequest;
