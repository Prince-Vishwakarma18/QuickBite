import express from "express";
import Shop from "../Models/shopModel.js";
import Order from "../Models/orderModel.js";
import cloudinary from "../Config/cloudinary.js";

export const addShop = async (req, res) => {
   try {
      const { shopName, city, state, address, lat, lon } = req.body;

      if (!shopName || !city || !state || !address) {
         return res.status(400).json({ message: "All fields are required" });
      }
      if (!req.file) {
         return res.status(400).json({ message: "Shop image is required" });
      }
      const existingShop = await Shop.findOne({ owner: req.user._id });

      if (existingShop) {
         return res
            .status(400)
            .json({ message: "You already have a shop registered" });
      }

      if (req.file.size > 5 * 1024 * 1024) {
         return res.status(400).json({
            success: false,
            message: "Image size too large. Max 5MB allowed",
         });
      }

      const uploadImg = new Promise((resolve, reject) => {
         const stream = cloudinary.uploader.upload_stream(
            { folder: "shopImg" },
            (err, result) => {
               if (err) reject(err);
               else resolve(result);
            },
         );
         stream.end(req.file.buffer);
      });

      const imageResult = await uploadImg;

      const newShop = await Shop.create({
         owner: req.user._id,
         shopName,
         shopImg: imageResult.secure_url,
         city: city.trim().toLowerCase(),
         state,
         address,
         ...(lat &&
            lon && {
               location: {
                  type: "Point",
                  coordinates: [Number(lon), Number(lat)],
               },
            }),
      });

      return res.status(201).json({
         success: true,
         message: "Shop created successfully",
         shop: newShop,
      });
   } catch (error) {
      console.error("Error in addShop:", error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

export const getShop = async (req, res) => {
   try {
      const shop = await Shop.findOne({ owner: req.user._id });

      if (!shop) {
         return res.status(404).json({
            success: false,
            message: "Shop not found",
         });
      }
      return res.status(200).json({
         success: true,
         shop,
      });
   } catch (error) {
      console.error("Error in getShop:", error);
      return res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

export const updateShop = async (req, res) => {
   try {
      const shop = await Shop.findOne({ owner: req.user._id });

      if (!shop) {
         return res.status(404).json({
            success: false,
            message: "Shop not found",
         });
      }

      shop.shopName = req.body.shopName;
      shop.city = req.body.city;
      shop.state = req.body.state;

      if (req.file) {
         const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
               { folder: "shopImg" },
               (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
               },
            );
            stream.end(req.file.buffer);
         });

         shop.shopImg = result.secure_url;
      }

      await shop.save();
      return res.status(200).json({
         success: true,
         message: "Shop updated successfully",
         shop,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         message: "Server Error",
      });
   }
};

export const getNearbyShops = async (req, res) => {
   try {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
         return res.status(400).json({
            success: false,
            message: "Location required",
         });
      }

      const shops = await Shop.find({
         location: {
            $near: {
               $geometry: {
                  type: "Point",
                  coordinates: [Number(lon), Number(lat)],
               },
               $maxDistance: 20000, // 20 KM
            },
         },
      });

      res.json({
         success: true,
         count: shops.length,
         shops,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Error fetching shops",
      });
   }
};

export const getAllDeliveredOrder = async (req, res) => {
   try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const shop = await Shop.findOne({
         owner: req.user.id,
      });

      if (!shop) {
         return res.status(404).json({
            success: false,
            message: "Shop not found",
         });
      }

      const orders = await Order.find({
         shop: shop._id,
         orderStatus: "DELIVERED",
      });

      const todayOrders = await Order.find({
         shop: shop._id,
         orderStatus: "DELIVERED",
         createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
         },
      });
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((acc, order) => {
         return acc + order.totalAmount;
      }, 0);

      const todayEarning = todayOrders.reduce((acc, order) => {
         return acc + order.totalAmount;
      }, 0);

      res.status(200).json({
         success: true,
         totalRevenue,
         todayEarning,
         totalOrders,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Server Error",
      });
   }
};
