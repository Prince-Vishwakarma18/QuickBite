import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
   {
      fullName: {
         type: String,
         required: false,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      mobileNumber: {
         type: String,
         required: false,
      },
      password: {
         type: String,
         required: false,
      },
      role: {
         type: String,
         enum: ["user", "admin", "delivery"],
         default: "user",
      },
      totalEarning: {
         type: Number,
         default: 0,
      },
      otp: {
         type: String,
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      otpExpiry: {
         type: Date,
         default: null,
      },
      location: {
         type: {
            type: String,
            enum: ["Point"],
            default: "Point",
         },
         coordinates: {
            type: [Number],
            default: [0, 0],
         },
      },
   },
   { timestamps: true },
);
userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
