import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// socket io
const io = new Server(server, {
   cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
   },
});

io.on("connection", (socket) => {
   socket.on("joinUser", (userId) => {
      socket.join(userId);
   });

   socket.on("joinDeliveryBoy", (userId) => {
      socket.join(userId);
   });

   socket.on("deliveryBoyLocationUpdate", (data) => {
      const { orderId, userId, lat, lon } = data;
      io.to(userId).emit("deliveryBoyLocationUpdated", {
         orderId,
         lat,
         lon,
      });
   });

   socket.on("joinShop", (shopId) => {
      socket.join(shopId);
   });

   socket.on("disconnect", () => {
      if (process.env.NODE_ENV !== "production") {
         console.log("User disconnected:", socket.id);
      }
   });
});

export { app, server, io };
