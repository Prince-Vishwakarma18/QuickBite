import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MdStorefront } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function ShopCard() {
   const navigate = useNavigate();
   const shops = useSelector((state) => state.user.shopsInMyCity);
   const scrollRef = useRef(null);

   useEffect(() => {
      const container = scrollRef.current;
      const interval = setInterval(() => {
         if (!container) return;
         container.scrollLeft = container.scrollLeft + 1;
         if (
            container.scrollLeft >=
            container.scrollWidth - container.clientWidth
         ) {
            container.scrollLeft = 0;
         }
      }, 20);
      return () => clearInterval(interval);
   }, [shops]);

   if (!shops || shops.length === 0)
      return (
         <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
            <div className="relative ">
               <div className=" rounded-full bg-amber-50 flex items-center justify-center">
                  <MdStorefront className="text-5xl text-amber-400" />
               </div>
            </div>

            <div className="flex flex-col gap-1.5">
               <p className="text-base font-semibold text-black">
                  No shops near you
               </p>
               <p className="text-[13px] text-zinc-500 max-w-56 leading-relaxed">
                  Looks like we haven't reached your area yet. We're expanding
                  soon!
               </p>
            </div>

            <p className="text-[11px] text-zinc-400 mt-1">
               More cities coming soon
            </p>
         </div>
      );

   return (
      <div className="py-2">
         <h2 className="text-lg font-extrabold text-black mb-3 pl-1">
            Nearby Shops
         </h2>

         <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
         >
            {shops.map((shop) => (
               <div
                  key={shop._id}
                  onClick={() =>
                     navigate(`/shop-foods/${shop._id}`, window.scrollTo(0, 0))
                  }
                  className="flex-none w-36 rounded border border-white/30 bg-white/10 shadow shadow-black/20 overflow-hidden cursor-pointer "
               >
                  {/* Img */}
                  <div className="relative h-28 overflow-hidden">
                     <img
                        src={shop.shopImg}
                        alt={shop.shopName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                     />
                     <div className="absolute bottom-2 left-2  text-white bg-black/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        {shop.deliveryTime ?? "25-30"} min
                     </div>
                  </div>

                  {/* Info */}
                  <div className="px-2.5 py-2.5">
                     <p className="text-[13px] font-extrabold text-black truncate">
                        <MdStorefront className="inline mr-1 text-zinc-500" />
                        {shop.shopName}
                     </p>
                     <p className="text-[11px] text-zinc-500 font-semibold flex items-center gap-0.5 mt-1">
                        <HiOutlineLocationMarker className="text-sm" />
                        {shop.city}
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default ShopCard;
