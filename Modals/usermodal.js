import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    address: String,
    pincode: Number,

    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        ordernumber: { type: String, unique: true, sparse: true },
        status: { type: String, default: "Yet to Confirm" },
        payment: { type: String, default: "Payment Pending" },
        amount: Number,
      },
    ],
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

export default UserModel;
