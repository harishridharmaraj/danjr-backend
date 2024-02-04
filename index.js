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
    const order = await OrderModel.create({
      email: userOrder.email,
      orderNumber: ordernum,
      products: userOrder.products,
      amount: userOrder.amount,
      paymethod: userOrder.paymethod,
    });

    const Ordermail = `We have received your Order .<br/>
      Your Order Number:${ordernum}
      Your Total Amount :${userOrder.amount}

    <br/>
    
    your order will be delivered within 30 Minutes.
    <br/>
    Best Regards,<br/>
    Dan JR Wedding Biriyani`;

    await transporter.sendMail({
      from: "Doubt Guru <support@doubtguru.in>",
      to: userOrder.email,
      subject: "The Special Dan JR Wedding Biriyani",
      html: Ordermail,
    });
    res.status(200).json({ message: "Order Created Successfully" });
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
