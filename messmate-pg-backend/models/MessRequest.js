import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    isVeg: { type: Boolean, default: true },
  },
  { _id: false }
);

const messRequestSchema = new mongoose.Schema(
  {
    // Basic Mess Info
    name: { type: String, required: true },
    location: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },

    // Menu items array similar to Mess model
    menu: {
      items: { type: [menuItemSchema], default: [] },
    },

    price_range: { type: String },
    offer: { type: String },
    pancard: { type: String },
    menuPhoto: { type: String },

    // Relationship
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Status control
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ Ensure no accidental unique index remains
messRequestSchema.index({ request_id: 1 }, { unique: false, sparse: true });

const MessRequest = mongoose.model("MessRequest", messRequestSchema);
export default MessRequest;
