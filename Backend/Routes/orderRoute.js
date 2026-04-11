import express from "express";
import {
   acceptOrder,
   cancelOrder,
   deliveryBoyOrder,
   getActiveOrder,
   getAdminOrders,
   getAllOrders,
   getAvailableOrders,
   getSingleOrder,
   placeOrder,
   sendDeliveryOtp,
   updateOrderStatus,
   verifyDeliveryOTP,
   verifyPayment,
} from "../Controllers/orderController.js";
import { protectRoute } from "../Middleware/protectRoute.js";

const router = express.Router();

router.post("/placed", protectRoute, placeOrder);
router.get("/all-orders", protectRoute, getAllOrders);
router.get("/admin-orders", protectRoute, getAdminOrders);
router.patch("/update/:id", protectRoute, updateOrderStatus);
router.get("/availabale-orders", protectRoute, getAvailableOrders);
router.patch("/accept-order/:id", protectRoute, acceptOrder);
router.get("/active-order", protectRoute, getActiveOrder);
router.get("/track/:id", protectRoute, getSingleOrder);
router.post("/send-otp", protectRoute, sendDeliveryOtp);
router.post("/verify-otp", protectRoute, verifyDeliveryOTP);
router.post("/verify-payment", protectRoute, verifyPayment);
router.get("/delivery-boy/orders", protectRoute, deliveryBoyOrder);
router.patch("/cancel-order/:id", protectRoute, cancelOrder);
export default router;
