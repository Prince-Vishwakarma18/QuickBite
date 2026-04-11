import Order from "../Models/orderModel.js";
import Food from "../Models/itemModel.js";
import Shop from "../Models/shopModel.js";
import User from "../Models/userModel.js";
import { io } from "../socket/socket.js";
import { sendMail } from "../Utils/sendEmail.js";
import Razorpay from "razorpay";

let razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateOTP = () => {
   return Math.floor(1000 + Math.random() * 9000).toString();
};

export const placeOrder = async (req, res) => {
   try {
      const { items, paymentMethod, deliveryAdd } = req.body;
      const userId = req.user.id;

      if (!items || items.length === 0) {
         return res.status(400).json({
            success: false,
            message: "Cart empty",
         });
      }

      if (
         !deliveryAdd?.text ||
         !deliveryAdd?.latitude ||
         !deliveryAdd?.longitude ||
         !deliveryAdd?.city
      ) {
         return res.status(400).json({
            success: false,
            message: "Delivery address required",
         });
      }

      const foodIds = items.map((item) => item.product || item._id);
      const foods = await Food.find({ _id: { $in: foodIds } });

      if (!foods.length) {
         return res.status(404).json({
            success: false,
            message: "Food not found",
         });
      }

      const shopId = foods[0].shop.toString();
      const isSameShop = foods.every((food) => food.shop.toString() === shopId);

      if (!isSameShop) {
         return res.status(400).json({
            success: false,
            message: "Order must be from one shop only",
         });
      }

      const orderItems = items.map((item) => {
         const food = foods.find(
            (f) => f._id.toString() === (item.product || item._id).toString(),
         );

         return {
            product: food._id,
            name: food.foodName,
            price: food.price,
            quantity: item.quantity,
            shop: food.shop,
            foodImg: food.foodImg,
         };
      });

      const subtotal = orderItems.reduce(
         (acc, item) => acc + item.price * item.quantity,
         0,
      );
      const deliveryFee = subtotal >= 299 ? 0 : 99;
      const totalAmount = subtotal + deliveryFee;

      // COD
      let earning;
      if (subtotal < 150) earning = 25;
      else if (subtotal <= 300) earning = 50;
      else earning = 75;
      if (paymentMethod === "COD") {
         const order = await Order.create({
            user: userId,
            shop: shopId,
            items: orderItems,
            subtotal,
            deliveryFee,
            totalAmount,
            paymentMethod,
            deliveryAdd,
            deliveryOTP: generateOTP(),
            deliveryBoyEarn: earning,
         });
         io.to(shopId).emit("newOrder", order);
         return res.json({
            success: true,
            order,
         });
      }

      //   razorpay
      const razorpayOrder = await razorpay.orders.create({
         amount: totalAmount * 100,
         currency: "INR",
      });

      return res.json({
         success: true,
         razorpayOrder,
         orderItems,
         shopId,
         subtotal,
         deliveryFee,
         totalAmount,
         deliveryAdd,
      });
   } catch (error) {
      console.log(error);

      res.status(500).json({
         success: false,
         message: "Order failed",
      });
   }
};

export const verifyPayment = async (req, res) => {
   try {
      const {
         razorpay_payment_id,
         items,
         subtotal,
         deliveryFee,
         totalAmount,
         shopId,
         deliveryAdd,
      } = req.body;

      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      if (!payment || payment.status !== "captured") {
         return res.json({
            success: false,
            message: "Payment failed",
         });
      }

      const existingOrder = await Order.findOne({
         "payment.razorpayPaymentId": razorpay_payment_id,
      });

      if (existingOrder) {
         return res.json({
            success: true,
            order: existingOrder,
         });
      }

      let earning;
      if (subtotal < 150) earning = 25;
      else if (subtotal <= 300) earning = 50;
      else earning = 75;

      const order = await Order.create({
         user: req.user.id,
         shop: shopId,
         items,
         subtotal,
         deliveryFee,
         totalAmount,
         deliveryAdd,
         paymentMethod: "ONLINE",
         paymentStatus: "PAID",
         deliveryOTP: generateOTP(),
         deliveryBoyEarn: earning,
         payment: {
            razorpayPaymentId: razorpay_payment_id,
            paid: true,
         },
      });
      io.to(shopId).emit("newOrder", order);

      res.json({
         success: true,
         order,
      });
   } catch (error) {
      console.log(error);

      res.status(500).json({
         success: false,
         message: "Payment verification failed",
      });
   }
};

export const getAllOrders = async (req, res) => {
   try {
      const userId = req.user.id;

      const allOrders = await Order.find({
         user: userId,
      })
         .sort({ createdAt: -1 })
         .populate("items.product");
      res.status(200).json({
         success: true,
         orders: allOrders,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Something went wrong",
      });
   }
};

export const getAdminOrders = async (req, res) => {
   try {
      const adminShop = await Shop.findOne({
         owner: req.user.id,
      });
      if (!adminShop) {
         return res.status(404).json({
            success: false,
            message: "Shop not found",
         });
      }
      const adminOrders = await Order.find({
         shop: adminShop._id,
      })
         .populate("user", "email")
         .populate("deliveryAssignment.deliveryBoy", "fullName mobileNumber")
         .sort({ createdAt: -1 });
      return res.status(201).json({
         success: true,
         orders: adminOrders,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Something went wrong",
      });
   }
};

export const updateOrderStatus = async (req, res) => {
   try {
      const orderId = req.params.id;
      const { status } = req.body;

      const allowedStatus = [
         "PLACED",
         "PREPARING",
         "READY_FOR_DELIVERY",
         "OUT_FOR_DELIVERY",
         "DELIVERED",
         "CANCELLED",
      ];

      if (!allowedStatus.includes(status)) {
         return res.status(400).json({
            success: false,
            message: "Invalid order status",
         });
      }

      const order = await Order.findById(orderId)
         .populate("shop")
         .populate("user");

      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found",
         });
      }

      if (order.shop.owner.toString() !== req.user._id.toString()) {
         return res.status(403).json({
            success: false,
            message: "Not authorized",
         });
      }

      order.orderStatus = status;
      let nearByDeliveryBoy = [];
      if (status === "READY_FOR_DELIVERY") {
         const shopLng = order.shop.location?.coordinates?.[0];
         const shopLat = order.shop.location?.coordinates?.[1];

         nearByDeliveryBoy = await User.find({
            role: "delivery",
            location: {
               $near: {
                  $geometry: {
                     type: "Point",
                     coordinates: [shopLng, shopLat],
                  },
                  $maxDistance: 20000, // 20km
               },
            },
         }).select("_id fullName");
      }

      await order.save();

      // socket
      const userId = order.user._id.toString();
      io.to(userId).emit("orderStatusUpdate", {
         _id: order._id,
         orderStatus: order.orderStatus,
         paymentStatus: order.paymentStatus,
      });

      if (status === "READY_FOR_DELIVERY") {
         // console.log("nearByDeliveryBoy:", nearByDeliveryBoy);
         nearByDeliveryBoy.forEach((boy) => {
            io.to(boy._id.toString()).emit("newDeliveryRequest", order);
            // console.log("newDeliveryRequest", order);
         });
      }
      res.json({
         success: true,
         message: "Order status updated",
         order,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

export const getAvailableOrders = async (req, res) => {
   try {
      const orders = await Order.find({
         orderStatus: "READY_FOR_DELIVERY",
         "deliveryAssignment.deliveryBoy": null,
      })
         .populate("shop")
         .populate("items");

      res.json({
         success: true,
         orders,
      });
   } catch (error) {
      console.log(error);
   }
};

export const acceptOrder = async (req, res) => {
   try {
      const orderId = req.params.id;

      if (req.user.role !== "delivery") {
         return res.status(403).json({
            success: false,
            message: "Only delivery boy can accept orders",
         });
      }

      const deliveryBoyId = req.user._id;

      const activeOrder = await Order.findOne({
         "deliveryAssignment.deliveryBoy": deliveryBoyId,
         "deliveryAssignment.status": { $in: ["ACCEPTED", "PICKED_UP"] },
      });

      if (activeOrder) {
         return res.status(400).json({
            success: false,
            message: "You already have an active delivery",
         });
      }

      const order = await Order.findOneAndUpdate(
         {
            _id: orderId,
            orderStatus: "READY_FOR_DELIVERY",
            "deliveryAssignment.deliveryBoy": null,
         },
         {
            $set: {
               "deliveryAssignment.deliveryBoy": deliveryBoyId,
               "deliveryAssignment.status": "ACCEPTED",
               "deliveryAssignment.acceptedAt": new Date(),
               orderStatus: "OUT_FOR_DELIVERY",
            },
         },
         { new: true },
      )
         .populate("deliveryAssignment.deliveryBoy", "location")
         .populate("user", "fullName mobileNumber");

      if (!order) {
         return res.status(400).json({
            success: false,
            message: "Order already taken by another delivery boy",
         });
      }
      const userId = order.user._id.toString();

      io.to(userId).emit("orderStatusUpdate", {
         _id: order._id,
         orderStatus: order.orderStatus,
      });
      res.json({
         success: true,
         message: "Order accepted successfully",
         order: {
            _id: order._id,

            user: {
               fullName: order.user.fullName,
               mobileNumber: order.user.mobileNumber,
            },

            deliveryAdd: {
               latitude: order.deliveryAdd.latitude,
               longitude: order.deliveryAdd.longitude,
               text: order.deliveryAdd.text,
            },

            items: order.items.map((item) => ({
               name: item.name,
               quantity: item.quantity,
               foodImg: item.foodImg,
            })),

            totalAmount: order.totalAmount,

            deliveryAssignment: {
               status: order.deliveryAssignment.status,
               deliveryBoy: {
                  location: order.deliveryAssignment.deliveryBoy.location,
               },
            },
         },
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

export const getActiveOrder = async (req, res) => {
   try {
      const order = await Order.findOne({
         "deliveryAssignment.deliveryBoy": req.user._id,
         "deliveryAssignment.status": { $in: ["ACCEPTED", "PICKED_UP"] },
      })
         .populate("user", "fullName mobileNumber")
         .populate("shop", "shopName shopImg city")
         .populate("items.product", "foodName foodImg price")
         .populate("deliveryAssignment.deliveryBoy", "location");

      res.json({
         success: true,
         order,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Failed to fetch active order",
      });
   }
};

export const getSingleOrder = async (req, res) => {
   try {
      const orderId = req.params.id;

      const order = await Order.findOne({
         _id: orderId,
         user: req.user.id,
      })
         .select(
            "items totalAmount orderStatus deliveryAdd deliveryAssignment.deliveryBoy user",
         )
         .populate(
            "deliveryAssignment.deliveryBoy",
            "fullName mobileNumber location",
         );

      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found",
         });
      }

      return res.status(200).json({
         success: true,
         order,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Failed to fetch active order",
      });
   }
};

export const sendDeliveryOtp = async (req, res) => {
   try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId).populate("user", "email");
      if (!order) {
         return res.status(404).json({
            message: "Order not found",
         });
      }
      // console.log(order.deliveryOTP);
      sendMail(order.user.email, order.deliveryOTP);
      res.status(200).json({
         message: "OTP sent to email",
      });
   } catch (error) {
      console.log(error);

      res.status(500).json({
         message: "Server error",
      });
   }
};

export const verifyDeliveryOTP = async (req, res) => {
   try {
      const { orderId, otp } = req.body;
      const order = await Order.findById(orderId);

      if (!order) {
         return res.status(404).json({
            message: "Order not found",
         });
      }

      if (order.deliveryOTP !== otp) {
         return res.status(400).json({
            message: "Invalid OTP",
         });
      }
      if (order.paymentMethod === "COD") {
         order.paymentStatus = "PAID";
         order.payment.paid = true;
      }
      const earning = order.deliveryBoyEarn || 0;

      const deliveryBoyId =
         order.deliveryAssignment.deliveryBoy?._id ||
         order.deliveryAssignment.deliveryBoy;

      await User.findByIdAndUpdate(deliveryBoyId, {
         $inc: { totalEarning: earning },
      });
      order.orderStatus = "DELIVERED";
      order.deliveryOTP = null;
      order.otpVerified = true;

      order.deliveryAssignment.status = "DELIVERED";
      order.deliveryAssignment.deliveredAt = new Date();

      await order.save();
      const userId = order.user.toString();
      io.to(userId).emit("orderStatusUpdate", {
         _id: order._id,
         orderStatus: order.orderStatus,
         paymentStatus: order.paymentStatus,
      });

      res.json({
         message: "Order delivered successfully",
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
   }
};

export const cancelOrder = async (req, res) => {
   try {
      const id = req.params.id;
      const order = await Order.findById(id);

      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found",
         });
      }

      if (!["PLACED", "PREPARING"].includes(order.orderStatus)) {
         return res.status(400).json({
            success: false,
            message: "Order cannot be cancelled now",
         });
      }
      order.orderStatus = "CANCELLED";
      await order.save();

      const userId = order.user._id.toString();
      io.to(userId).emit("orderStatusUpdate", {
         _id: order._id,
         orderStatus: order.orderStatus,
      });

      return res.status(200).json({
         success: true,
         message: "Order cancelled successfully",
         order,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

export const deliveryBoyOrder = async (req, res) => {
   try {
      const startDay = new Date();
      startDay.setHours(0, 0, 0);

      const endDay = new Date();
      endDay.setHours(23, 59, 59, 999);

      const todayOrders = await Order.find({
         "deliveryAssignment.deliveryBoy": req.user.id,
         "deliveryAssignment.status": "DELIVERED",
         createdAt: {
            $gte: startDay,
            $lte: endDay,
         },
      });

      const orders = await Order.find({
         "deliveryAssignment.deliveryBoy": req.user.id,
         "deliveryAssignment.status": "DELIVERED",
      })
         .sort({ createdAt: -1 })
         .populate("shop", "shopName shopImg");

      const todayEarning = todayOrders.reduce((acc, order) => {
         return acc + order.deliveryBoyEarn;
      }, 0);

      const totalRevenue = orders.reduce((acc, order) => {
         return acc + order.deliveryBoyEarn;
      }, 0);
      return res.status(200).json({
         success: true,
         todayEarning,
         totalRevenue,
         orders,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};
