import mongoose from "mongoose";

export const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGO_DB_URI);
      console.log("MongoDB Connected  Successfully");
   } catch (error) {
      console.log("Error in DB connection", error);
   }
};
