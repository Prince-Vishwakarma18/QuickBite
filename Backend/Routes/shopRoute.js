import express from "express";
import { protectRoute } from "../Middleware/protectRoute.js";
import {
   addShop,
   getShop,
   updateShop,
   getAllDeliveredOrder,
   getNearbyShops,
} from "../Controllers/shopController.js";
import { upload } from "../Config/multer.js";
import { isAdmin } from "../Middleware/isAdmin.js";

const router = express.Router();

router.post(
   "/create-shop",
   protectRoute,
   isAdmin,
   upload.single("shopImg"),
   addShop,
);
router.get("/admin-shops", protectRoute, isAdmin, getShop);
router.patch(
   "/update",
   protectRoute,
   isAdmin,
   upload.single("shopImg"),
   updateShop,
);
router.get("/", getNearbyShops);

router.get("/delivered-orders", protectRoute, isAdmin, getAllDeliveredOrder);

export default router;
