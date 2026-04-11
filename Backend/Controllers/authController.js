import express from "express";
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/generateToken.js";
import Shop from "../Models/shopModel.js";
import { sendMail } from "../Utils/sendEmail.js";

const generateOTP = () => {
   return Math.floor(1000 + Math.random() * 9000).toString();
};

export const signup = async (req, res) => {
   try {
      const {
         fullName,
         email,
         password,
         confirmPassword,
         mobileNumber,
         role,
         otp,
      } = req.body;

      if (!fullName || !email || !password || !mobileNumber || !otp) {
         return res.status(400).json({
            success: false,
            message: "All fields required",
         });
      }

      if (mobileNumber.length !== 10) {
         return res.status(400).json({
            success: false,
            message: "Enter 10 digit mobile number",
         });
      }

      if (password !== confirmPassword) {
         return res.status(400).json({
            success: false,
            message: "Passwords do not match",
         });
      }

      const user = await User.findOne({ email, isVerified: false });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "Please send OTP first",
         });
      }

      if (user.otp !== otp) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP",
         });
      }

      if (!user.otpExpiry || user.otpExpiry < new Date()) {
         return res.status(400).json({
            success: false,
            message: "OTP expired. Please request a new one.",
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.fullName = fullName;
      user.password = hashedPassword;
      user.mobileNumber = mobileNumber;
      user.role = role || "user";
      user.otp = undefined;
      user.isVerified = true;
      await user.save();

      generateToken(res, user._id);

      res.status(201).json({
         success: true,
         message: "Account created successfully",
         user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role,
         },
      });
   } catch (error) {
      console.log("Error in signup controller", error);
      res.status(500).json({
         message: "Internal server error",
      });
   }
};

export const sendOtp = async (req, res) => {
   try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email, isVerified: true });

      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "Email already exists",
         });
      }

      const otp = generateOTP();
      const tempUser = await User.findOne({ email, isVerified: false });

      if (tempUser) {
         tempUser.otp = otp;
         tempUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
         await tempUser.save();
      } else {
         await User.create({
            email,
            otp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
         });
      }

      sendMail(email, otp);
      res.status(200).json({
         success: true,
         message: "OTP sent successfully",
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: "Internal server error",
      });
   }
};

export const signin = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Enter email and password",
         });
      }

      const user = await User.findOne({ email, isVerified: true });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User does not exist",
         });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
         return res.status(400).json({
            success: false,
            message: "Invalid password",
         });
      }

      const shop = await Shop.findOne({ owner: user._id });
      generateToken(res, user._id);

      res.status(200).json({
         success: true,
         message: "Login successful",
         user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            shop: shop?._id || null,
         },
      });
   } catch (error) {
      console.log("Error in signin controller", error);
      res.status(500).json({
         message: "Internal server error",
      });
   }
};

export const signout = (req, res) => {
   try {
      res.clearCookie("token", {
         httpOnly: true,
         sameSite: "strict",
         secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({
         success: true,
         message: "Logged out successfully",
      });
   } catch (error) {
      console.log("Error in logout controller", error);
      res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};

export const updateUserLocation = async (req, res) => {
   try {
      const { lat, lon } = req.body;

      if (!lat || !lon) {
         return res.status(400).json({
            success: false,
            message: "Latitude and Longitude are required",
         });
      }
      const user = await User.findById(req.user.id);

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found!",
         });
      }
      if (user.role !== "delivery") {
         return res.status(403).json({
            success: false,
            message: "Only delivery boys can update location",
         });
      }

      user.location = {
         type: "Point",
         coordinates: [lon, lat],
      };

      await user.save();

      return res.status(200).json({
         success: true,
         message: "Location updated successfully",
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Server error",
      });
   }
};
