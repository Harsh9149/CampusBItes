import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.ObjectId,
        ref: "Products",
        },
        count: {
          type: Number,
        }
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Shipped",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
