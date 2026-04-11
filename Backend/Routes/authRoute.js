import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import {
   signup,
   signin,
   signout,
   updateUserLocation,
   sendOtp,
} from "../Controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/send-otp", sendOtp);

router.post("/signin", signin);

router.post("/signout", signout);

router.post("/update-location", protectRoute, updateUserLocation);

export default router;
