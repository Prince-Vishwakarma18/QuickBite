import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

function Earning() {
   const [earning, setEarning] = useState({
      totalRevenue: 0,
      todayEarning: 0,
      totalOrders: 0,
   });

   useEffect(() => {
      const deliveredOrder = async () => {
         try {
            const res = await axiosInstance.get("/shop/delivered-orders");
            setEarning({
               totalRevenue: res.data.totalRevenue,
               todayEarning: res.data.todayEarning,
               totalOrders: res.data.totalOrders,
            });
         } catch (error) {
            console.log(error);
         }
      };
      deliveredOrder();
   }, []);

   return (
      <div className="flex flex-row gap-2 py-2">
         {/* Total Earning */}
         <div className="flex-1 rounded-xl p-3 bg-orange-500 shadow-md shadow-orange-500/30 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-white/10 rounded-full" />
            <p className="text-xs uppercase tracking-wide text-white/75 font-medium mb-1">
               Total Earning
            </p>
            <h1 className="text-lg font-black text-white">
               <span>₹{earning.totalRevenue}</span>
            </h1>
         </div>

         {/* Today Earning */}
         <div className="flex-1 rounded-xl p-3 bg-white/10 border border-black/10">
            <p className="text-xs uppercase tracking-wide text-neutral-500 font-medium mb-1">
               Today's Earning
            </p>
            <h1 className="text-lg font-black text-orange-500">
               <span>₹{earning.todayEarning}</span>
            </h1>
         </div>

         <div className="flex-1 rounded-xl p-3 bg-white/10 border border-black/10">
            <p className="text-xs uppercase tracking-wide text-neutral-500 font-medium mb-1">
               Delivered Orders
            </p>
            <h1 className="text-lg font-black text-green-500">
               {earning.totalOrders}
            </h1>
         </div>
      </div>
   );
}

export default Earning;
