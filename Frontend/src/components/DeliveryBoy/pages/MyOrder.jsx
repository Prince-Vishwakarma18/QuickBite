import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";

import axiosInstance from "../../../services/api";
import { useNavigate } from "react-router-dom";
function MyOrder() {
   const navigate = useNavigate();
   const [orders, setOrders] = useState([]);
   const [earning, setTotalEarning] = useState({
      todayEarning: 0,
      totalRevenue: 0,
   });
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const res = await axiosInstance.get(`order/delivery-boy/orders`);
            setOrders(res.data.orders);
            setTotalEarning({
               todayEarning: res.data.todayEarning,
               totalRevenue: res.data.totalRevenue,
            });
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      };
      fetchOrders();
   }, []);

   if (loading) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-orange-400 font-medium tracking-wide">
               Loading your orders...
            </p>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-yellow-50 px-4 py-6 max-w-4xl mx-auto">
         <div className="mb-6 relative flex items-center">
            <button
               onClick={() => navigate(-1)}
               className="absolute left-0 text-black "
            >
               <IoArrowBack className="text-2xl" />
            </button>
            <h1 className="text-2xl text-center w-full font-bold text-black">
               MY <span className="text-orange-500">DELIVERIES</span>
            </h1>
         </div>

         <div className="grid grid-cols-3 gap-3 mb-7">
            {/* Earnings */}
            <div className="bg-orange-500 rounded-2xl p-4 text-white">
               <p className="text-xs font-medium opacity-80 mb-1">
                  Total Earnings
               </p>
               <p className="text-lg sm:text-3xl  text-white font-bold">
                  ₹{earning.totalRevenue || 0}
               </p>
            </div>
            <div className="bg-orange-500 rounded-2xl p-4 text-white">
               <p className="text-xs font-medium opacity-80 mb-1">
                  Today's Earning
               </p>
               <p className="text-lg sm:text-3xl  text-white font-bold">
                  ₹{earning.todayEarning || 0}
               </p>
            </div>
            {/* Deliveries */}
            <div className=" border border-black/20 shadow rounded-2xl p-4">
               <p className="text-xs font-medium text-black mb-1">
                  Deliveries Done
               </p>
               <p className="text-lg sm:text-3xl font-black text-green-400">
                  {orders.length}
               </p>
            </div>
         </div>

         {/* Orders  */}
         {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-black">
               <span className="text-5xl mb-3">📦</span>
               <p className="font-semibold text-gray-600">No deliveries yet</p>
               <p className="text-sm mt-1">
                  Your completed orders will appear here
               </p>
            </div>
         ) : (
            <div className="flex flex-col gap-4 font-semibold">
               {orders.map((order) => (
                  <div
                     key={order._id}
                     className="bg-white/10 text-zinc-400 rounded-2xl border border-black/20 shadow overflow-hidden hover:border-black/30 transition"
                  >
                     {/* Shop */}
                     <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10">
                        <img
                           src={order.shop?.shopImg}
                           alt="shop"
                           className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                        />

                        <div className="flex-1 min-w-0">
                           <p className="font-semibold text-black text-sm truncate">
                              {order.shop?.shopName}
                           </p>
                           <p className="text-xs text-zinc-500">
                              {order.shop?.city}
                           </p>
                        </div>

                        {/* Payment */}
                        <span
                           className={`text-xs font-extrabold font-stretch-75% px-2.5 py-1 rounded-full ${
                              order.paymentStatus === "PAID"
                                 ? " text-green-400 border border-black/10 "
                                 : "text-yellow-400 border border-black/10"
                           }`}
                        >
                           {order.paymentStatus}
                        </span>
                     </div>

                     {/* Items */}
                     <div className="px-4 py-3 flex flex-col gap-2">
                        {order.items.map((item, index) => (
                           <div key={index} className="flex items-center gap-3">
                              <img
                                 src={item.foodImg}
                                 alt={item.name}
                                 className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                              />

                              <p className="text-sm text-gray-800 flex-1">
                                 {item.name}
                              </p>

                              <span className="text-xs text-black font-medium border border-black/10 px-2 py-0.5 rounded-full">
                                 x{item.quantity}
                              </span>
                           </div>
                        ))}
                     </div>

                     {/* Delivery Add */}
                     <div className=" py-2 px-1 bg-white/10 flex items-start gap-2">
                        <p className="text-xs flex items-center gap-2 text-zinc-600 leading-relaxed">
                           <FaLocationDot color="red" />
                           {order.deliveryAdd?.text}
                        </p>
                     </div>

                     {/* Footer */}
                     <div className="px-4 py-3 border-t border-black/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div>
                              <p className="text-base font-bold text-orange-400">
                                 ₹{order.totalAmount}
                              </p>
                              <p className="text-xs text-zinc-500">
                                 Order total
                              </p>
                           </div>

                           <div className="h-8 w-px bg-zinc-700" />

                           {/* Earning */}
                           <div>
                              <p className="text-base font-bold text-green-400">
                                 ₹{order.deliveryBoyEarn}
                              </p>
                              <p className="text-xs text-zinc-500">
                                 Your earning
                              </p>
                           </div>

                           <div className="h-8 w-px bg-zinc-700" />

                           {/* Date */}
                           <div>
                              <p className="text-xs font-semibold text-gray-800">
                                 {new Date(order.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                       day: "2-digit",
                                       month: "short",
                                       year: "numeric",
                                    },
                                 )}
                              </p>
                           </div>
                        </div>

                        {/* Status */}
                        <span
                           className={`text-xs px-3 py-1 font-extrabold rounded-full ${
                              order.orderStatus === "DELIVERED"
                                 ? " text-green-400"
                                 : " text-yellow-400"
                           }`}
                        >
                           {order.orderStatus}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default MyOrder;
