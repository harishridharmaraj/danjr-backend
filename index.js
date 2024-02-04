import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import UserModel from "./Modals/usermodal.js";
import OrderModel from "./Modals/ordermodal.js";

const app = express();
app.use(cors({ credentials: true }));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mailpass = process.env.mailpass;

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "support@doubtguru.in",
    pass: mailpass,
  },
});

app.get("/", async (req, res) => {
  const orders = await OrderModel.find({});
  res.send(orders);
});

app.post("/orders", async (req, res) => {
  const userOrder = req.body;
  const ordernum = randomstring.generate(6);
  console.log(userOrder);
  console.log(ordernum);
  try {
    const user = await UserModel.findOne({ email: userOrder.email });

    if (!user) {
      const order = await OrderModel.create({
        email: userOrder.email,
        orderNumber: ordernum,
        products: userOrder.products,
        amount: userOrder.amount,
        paymethod: userOrder.paymethod,
      });

      const user = await UserModel.create({
        name: userOrder.name,
        email: userOrder.email,
        phone: userOrder.phone,
        address: userOrder.address,
        pincode: userOrder.pincode,
      });
      console.log(order._id);
      user.orders.push({
        orderId: order._id,
        ordernumber: ordernum,
        amount: userOrder.amount,
      });
      const updatedUser = await user.save();
      res.status(200).json({ message: "Order Created Successfully" });
    }

    if (user) {
      const order = await OrderModel.create({
        email: userOrder.email,
        orderNumber: ordernum,
        products: userOrder.products,
        amount: userOrder.amount,
        paymethod: userOrder.paymethod,
      });
      user.orders.push({
        orderId: order._id,
        ordernumber: ordernum,
        amount: userOrder.amount,
      });
      const updatedUser = await user.save();

      const Ordermail = `We have received your Order .<br/>
    <br/>
      Your Order Number:${ordernum}<br/>
      <br/>
      Your Total Amount :${userOrder.amount}

    <br/>
    <br/>
    your order will be delivered within 30 Minutes.
    <br/><br/>
    Best Regards,<br/>
    Dan JR Wedding Biriyani`;
      console.log(Ordermail);
      const info = await transporter.sendMail({
        from: "Doubt Guru <support@doubtguru.in>",
        to: userOrder.email,
        subject: "The Special Dan JR Wedding Biriyani",
        html: Ordermail,
      });
      console.log("Message sent:" + info.messageId);
      res.status(200).json({ message: "Order Created Successfully" });
      console.log("orderPlaced");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("Port is on 4000");
});
// MongoDB connect
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO DB is Connected");
  })
  .catch((error) => {
    console.log("Mongo Connection Error", error);
  });
