import mongoose from "mongoose";

const itemModel = new mongoose.Schema(
   {
      shop: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Shop",
      },
      foodName: {
         type: String,
         required: true,
      },
      foodImg: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      category: {
         type: String,
         enum: [
            "Dessert",
            "Chinese",
            "Chicken",
            "Mutton",
            "Italian",
            "Pizza",
            "Burger",
            "Fast Food",
            "South Indian",
            "North Indian",
            "Snacks",
            "Bakery",
         ],
         required: true,
      },
      foodType: {
         type: String,
         enum: ["Veg", "Non-Veg"],
         required: true,
      },
      ratings: [
         {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: {
               type: Number,
               min: 1,
               max: 5,
            },
         },
      ],
      averageRating: {
         type: Number,
         default: 0,
      },
      totalRatings: {
         type: Number,
         default: 0,
      },
   },
   { timestamps: true },
);

export default mongoose.model("Food", itemModel);
