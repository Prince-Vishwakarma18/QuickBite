import express from "express";
import Shop from "../Models/shopModel.js";
import Food from "../Models/itemModel.js";
import cloudinary from "../Config/cloudinary.js";
import Order from "../Models/orderModel.js";

export const addFood = async (req, res) => {
   try {
      const { foodName, price, category, foodType } = req.body;

      if (!foodName || !price || !category || !foodType) {
         return res.status(400).json({
            success: false,
            message: "All fields required",
         });
      }

      if (!req.file) {
         return res.status(400).json({
            success: false,
            message: "Food image is required",
         });
      }

      const shop = await Shop.findOne({ owner: req.user._id });

      if (!shop) {
         return res.status(400).json({
            success: false,
            message: "Please Create Shop First!",
         });
      }

      // Upload image
      const uploadImg = new Promise((resolve, reject) => {
         const stream = cloudinary.uploader.upload_stream(
            { folder: "foodImg" },
            (err, result) => {
               err ? reject(err) : resolve(result);
            },
         );
         stream.end(req.file.buffer);
      });

      const imageResult = await uploadImg;

      const newFood = await Food.create({
         foodName,
         price,
         category,
         foodType,
         foodImg: imageResult.secure_url,
         shop: shop._id,
      });

      return res.status(201).json({
         success: true,
         message: "Food added successfully",
         food: newFood,
      });
   } catch (error) {
      console.error("Error in addFood:", error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

export const getFoodList = async (req, res) => {
   try {
      if (!req.user) {
         return res.status(401).json({
            success: false,
            message: "Unauthorized",
         });
      }

      const shop = await Shop.findOne({ owner: req.user._id });

      if (!shop) {
         return res.status(404).json({
            success: false,
            message: "Shop not found. Create shop first.",
         });
      }

      const foods = await Food.find({ shop: shop._id }).sort({ createdAt: -1 });

      return res.status(200).json({
         success: true,
         count: foods.length,
         foods,
      });
   } catch (error) {
      console.error("Error in getFoodList:", error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

export const deleteFood = async (req, res) => {
   try {
      const { id } = req.params;
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop) {
         return res.status(404).json({
            success: false,
            message: "Shop not found",
         });
      }

      const food = await Food.findOne({ _id: id, shop: shop._id });
      if (!food) {
         return res.status(404).json({
            success: false,
            message: "Food not found or unauthorized",
         });
      }
      await Food.findByIdAndDelete(id);

      return res.status(200).json({
         success: true,
         message: "Food deleted successfully",
      });
   } catch (error) {
      console.error("Error in deleteFood:", error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

export const getFoods = async (req, res) => {
   try {
      const { city } = req.query;

      let foods;

      if (city && city.trim() !== "") {
         foods = await Food.find()
            .sort({ createdAt: -1 })
            .populate({
               path: "shop",
               match: { city: city.trim().toLowerCase() },
            });

         foods = foods.filter((food) => food.shop !== null);
      } else {
         foods = await Food.find().sort({ createdAt: -1 }).populate("shop");
      }

      res.json({
         success: true,
         foods,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error fetching foods",
      });
   }
};

export const getShopItems = async (req, res) => {
   try {
      const shopId = req.params.id;
      // console.log(shopId);
      const foods = await Food.find({
         shop: shopId,
      }).populate("shop", "shopName shopImg city address state");
      return res.status(200).json({
         success: true,
         foods,
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "server error in fetch food by shop",
      });
   }
};

export const foodByCat = async (req, res) => {
   try {
      const { cat } = req.params;

      const foods = await Food.find({ category: cat }).populate(
         "shop",
         "shopName",
      );

      if (foods.length === 0) {
         return res.status(404).json({
            success: false,
            message: "No food found",
         });
      }

      return res.status(200).json({
         success: true,
         count: foods.length,
         foods,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         message: "server error in foodCat",
      });
   }
};

export const giveFoodRating = async (req, res) => {
   try {
      const { rating } = req.body;
      const userId = req.user._id;
      const foodId = req.params.id;

      const deliveredOrder = await Order.find({
         user: userId,
         orderStatus: "DELIVERED",
         "items.product": foodId,
      });

      if (deliveredOrder.length === 0) {
         return res.status(403).json({
            message: "You can only rate food you have ordered and received",
         });
      }

      const food = await Food.findById(foodId);
      if (!food) {
         return res.status(404).json({
            success: false,
            message: "Food not found",
         });
      }

      const existingRatingIndex = food.ratings.findIndex(
         (r) => r.user.toString() === userId.toString(),
      );

      if (existingRatingIndex !== -1) {
         food.ratings[existingRatingIndex].rating = rating;
      } else {
         food.ratings.push({ user: userId, rating });
      }

      const total = food.ratings.reduce((sum, r) => sum + r.rating, 0);
      food.totalRatings = food.ratings.length;
      food.averageRating = total / food.ratings.length;

      await food.save();

      res.json({
         success: true,
         message:
            existingRatingIndex !== -1 ? "Rating updated" : "Rating submitted",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};

export const getSingleFood = async (req, res) => {
   try {
      const id = req.params.id;
      const food = await Food.findById(id).populate(
         "shop",
         "shopName shopImg city state",
      );

      return res.status(200).json({
         success: true,
         food,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};
