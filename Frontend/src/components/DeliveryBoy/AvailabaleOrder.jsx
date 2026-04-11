import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../services/api";
import toast from "react-hot-toast";
import { socket } from "../../socket/socket";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOrder } from "../../store/mapSlice";

function AvailabaleOrder() {
   const dispatch = useDispatch();
   const authUser = useSelector((state) => state.user.authUser);
   const activeOrder = useSelector((state) => state.map.activeOrder);

   const [orders, setOrders] = useState([]);
   const [loadingId, setLoadingId] = useState(null);
   const [loading, setLoading] = useState(true);

   const fetchOrders = useCallback(async () => {
      try {
         const res = await axiosInstance.get("/order/availabale-orders");
         setOrders(res.data.orders);
      } catch (error) {
         toast.error("Failed to fetch orders");
      } finally {
         setLoading(false);
      }
   }, []);

   // Socket
   useEffect(() => {
      if (!authUser?._id) return;
      if (!socket.connected) {
         socket.connect();
         socket.on("connect", () => {
            socket.emit("joinDeliveryBoy", authUser._id);
         });
      } else {
         socket.emit("joinDeliveryBoy", authUser._id);
      }
      socket.on("newDeliveryRequest", (order) => {
         console.log("neqOrderdel", order);
         toast.dismiss();
         toast.success("New Delivery Request");
         setOrders((prev) => [order, ...prev]);
      });

      return () => socket.off("newDeliveryRequest");
   }, [authUser?._id]);

   useEffect(() => {
      fetchOrders();
   }, [fetchOrders]);

   // Accept order
   const handleAcceptOrder = async (orderId) => {
      if (activeOrder) {
         toast.dismiss();
         toast.error("Complete active delivery first");
         return;
      }
      try {
         setLoadingId(orderId);
         const res = await axiosInstance.patch(
            `/order/accept-order/${orderId}`,
         );
         dispatch(setActiveOrder(res.data.order));
         toast.dismiss();
         toast.success("Order accepted");

         setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } catch (error) {
         toast.dismiss();
         toast.error(error.response?.data?.message || "Failed to accept order");
      } finally {
         setLoadingId(null);
      }
   };

   if (loading)
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 gap-4">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-black text-sm">Loading food details...</p>
         </div>
      );

   return (
      <div className="p-3 bg-yellow-50 shadow rounded">
         <h2 className="text-xl text-center uppercase sm:text-2xl text-black font-bold mb-4">
            Available <span className="text-orange-500">Orders</span>
         </h2>

         {orders.length === 0 ? (
            <div className="text-center text-black font-bold mt-10">
               No orders available
            </div>
         ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {orders.map((order) => (
                  <div
                     key={order._id}
                     className="bg-white/10 rounded-2xl shadow  shadow-black/20 p-4 flex flex-col gap-4 border border-black/20"
                  >
                     {/* Shop Info */}
                     <div className="flex items-center bg-black/5 gap-3 text-black  shadow shadow-black/10 ">
                        <img
                           src={order.shop.shopImg}
                           alt="shop"
                           className="w-12 h-12 rounded object-cover border"
                        />
                        <div>
                           <p className="font-semibold text-sm">
                              {order.shop.shopName}
                           </p>
                           <p className="text-xs text-gray-500">
                              {order.shop.city}
                           </p>
                        </div>
                     </div>

                     {/* Items */}
                     <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                           <div
                              key={index}
                              className="flex w-full items-center gap-2 bg-black/5 text-black shadow shadow-black/20 hover:shadow py-1 rounded-lg"
                           >
                              <img
                                 src={item.foodImg}
                                 alt={item.name}
                                 className="w-12 h-12 rounded object-cover"
                              />
                              <span className="text-xs">
                                 {item.name} x {item.quantity}
                              </span>
                           </div>
                        ))}
                     </div>

                     {/* Address */}
                     <p className="text-xs flex items-center gap-2 text-gray-600">
                        <FaLocationDot color="red" size={18} />{" "}
                        {order.deliveryAdd?.text}
                     </p>

                     {/* Footer */}
                     <div className="flex items-center justify-between mt-auto">
                        <div>
                           <p className="font-bold text-lg text-green-600">
                              ₹{order.totalAmount}
                           </p>
                           <p className="text-xs text-gray-500 font-medium">
                              Earn ₹{order.deliveryBoyEarn}
                           </p>
                        </div>

                        <button
                           onClick={() => handleAcceptOrder(order._id)}
                           disabled={loadingId === order._id}
                           className="bg-orange-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
                        >
                           {loadingId === order._id ? "Accepting..." : "Accept"}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default AvailabaleOrder;
