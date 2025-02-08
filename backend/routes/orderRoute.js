import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

import {
  getAllOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateOrderStatus,
  userOrders,
  verifyStripePayment,
} from "../controllers/orderController.js";


const orderRouter = express.Router();
// admin feature
orderRouter.post("/list", adminAuth, getAllOrders);
orderRouter.post("/status", adminAuth, updateOrderStatus);
// payment feature
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// user
orderRouter.post("/user-orders", authUser, userOrders);

//verify payment
orderRouter.post("/verify-stripe", authUser, verifyStripePayment);

export default orderRouter;