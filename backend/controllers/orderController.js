import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import orderModel from "../models/orderModel.js";

const currency = "inr";
const delivery_charge = 10.00;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const { userId, address, amount, items } = req.body;

    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData)
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({success: true, message:"Order Placed"})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
    
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, address, amount, items } = req.body;
    const { origin } = req.headers;
    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save()
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: delivery_charge,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
};

const placeOrderRazorpay = async (req, res) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    res.json({success:true, orders})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });

    res.json({success:true, orders})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({success:true,message: 'Status Updated'})
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
};

const verifyStripePayment = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
      );
      await userModel.findByIdAndUpdate(
        userId,
        { cartData: {} },
      );

      res.json({success:true, message:"successfully verified"})
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false, message:error.message})
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  getAllOrders,
  userOrders,
  updateOrderStatus,
  verifyStripePayment,
};