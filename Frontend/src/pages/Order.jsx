import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../services/api";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";
import OrderCard from "../components/OrderCard";
import { IoArrowBack } from "react-icons/io5";

function Order() {
   const navigate = useNavigate();
   const authUser = useSelector((state) => state.user.authUser);
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchOrders = async () => {
         setLoading(true);
         try {
            const res = await axiosInstance.get("/order/all-orders");
            setOrders(res.data.orders);
         } catch (error) {
            console.log("Order fetch error:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchOrders();
   }, []);

   // socket
   useEffect(() => {
      socket.on("orderStatusUpdate", (updatedOrder) => {
         const { _id, orderStatus, paymentStatus } = updatedOrder;
         setOrders((prev) =>
            prev.map((order) =>
               order._id.toString() === _id.toString()
                  ? { ...order, orderStatus, paymentStatus }
                  : order,
            ),
         );
      });
      return () => socket.off("orderStatusUpdate");
   }, []);

   const handleCancelOrder = async (id) => {
      try {
         const res = await axiosInstance.patch(`/order/cancel-order/${id}`);
         if (res.data.success) {
            setOrders((prev) =>
               prev.map((order) =>
                  order._id === id
                     ? { ...order, orderStatus: "CANCELLED" }
                     : order,
               ),
            );
         }
      } catch (error) {
         console.log(error);
         toast.error("Failed to cancel order");
      }
   };

   if (!authUser) return <Navigate to="/" replace />;
   if (loading)
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 gap-4">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-black text-sm">Loading food details...</p>
         </div>
      );
   return (
      <div className="px-4 py-4 text-black min-h-screen">
         <div className="relative flex items-center mb-4">
            <button
               onClick={() => navigate(-1)}
               className="absolute left-0 top-1  text-black"
            >
               {" "}
               <IoArrowBack className="text-2xl" />
            </button>
            <h1 className=" w-full text-center font-bold text-2xl mb-4 text-black">
               MY <span className="text-orange-500">ORDERS</span>
            </h1>
         </div>
         {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found</p>
         ) : (
            <div className="space-y-5">
               {orders.map((order) => (
                  <OrderCard
                     key={order._id}
                     order={order}
                     handleCancelOrder={handleCancelOrder}
                  />
               ))}
            </div>
         )}
      </div>
   );
}

export default Order;
