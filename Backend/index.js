import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./Config/db.js";
import authRoutes from "./Routes/authRoute.js";
import shopRoutes from "./Routes/shopRoute.js";
import foodRoute from "./Routes/foodRoute.js";
import orderRoute from "./Routes/orderRoute.js";

import { app, server } from "./socket/socket.js";

// DB connect
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
   }),
);

app.get("/", (req, res) => {
   res.send("Hello");
});

// api
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/food", foodRoute);
app.use("/api/order", orderRoute);

server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
