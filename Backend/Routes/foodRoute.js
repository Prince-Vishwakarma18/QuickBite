import express from "express";
import {
   addFood,
   deleteFood,
   foodByCat,
   getFoodList,
   getFoods,
   getShopItems,
   getSingleFood,
   giveFoodRating,
} from "../Controllers/foodControler.js";
import { protectRoute } from "../Middleware/protectRoute.js";
import { upload } from "../Config/multer.js";
import { isAdmin } from "../Middleware/isAdmin.js";

const router = express.Router();
router.post("/add", protectRoute, isAdmin, upload.single("foodImg"), addFood);
router.get("/admin/food-list", protectRoute, isAdmin, getFoodList);
router.delete("/delete/:id", protectRoute, isAdmin, deleteFood);
router.post("/rate/:id", protectRoute, giveFoodRating);
router.get("/:id", getSingleFood);
router.post("/shop-foods/:id", getShopItems);
router.get("/category/:cat", foodByCat);
router.get("/", getFoods);

export default router;
