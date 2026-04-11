import mongoose from "mongoose";

const shopModel = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      shopName: {
         type: String,
         required: true,
      },
      shopImg: {
         type: String,
         required: true,
      },
      city: {
         type: String,
         required: true,
      },
      state: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         required: true,
      },
      items: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
         },
      ],
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

shopModel.index({ location: "2dsphere" });

export default mongoose.model("Shop", shopModel);
