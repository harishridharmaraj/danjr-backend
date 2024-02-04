import mongoose, { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    email: { type: String, required: true },
    orderNumber: { type: String, unique: true, sparse: true },
    orderStatus: { type: String, default: "Confirmed" },
    paymentStatus: { type: String, default: "Payment Pending" },
    products: Array,
    amount: Number,
    paymethod: String,
  },
  { timestamps: true }
);

const OrderModel = model("Order", OrderSchema);

export default OrderModel;
