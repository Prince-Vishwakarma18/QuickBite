import React from "react";
import foodBanner from "../../assets/food-banner.jpg";
import { useNavigate } from "react-router-dom";

function FoodBanner() {
   const navigate = useNavigate();
   return (
      <div className="relative rounded-4xl shadow shadow-white/15 border border-white/30 overflow-hidden my-2 group">
         <img
            src={foodBanner}
            alt="food banner"
            className="h-72 sm:h-96 w-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
         />
         <div className="absolute inset-0 bg-black/40"></div>
         <div className="absolute inset-0 flex items-center">
            <div className="text-white max-w-xl px-6 md:px-16">
               <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                  Hungry? <br />{" "}
                  <span className="text-orange-500">We've Got You </span>{" "}
                  Covered 😋
               </h1>
               <p className="mt-4 text-gray-200">
                  Get your favorite food delivered hot & fresh in minutes with{" "}
                  <span className="text-orange-500">QuickBite.</span>
               </p>
               <div className="flex gap-5">
                  <button
                     onClick={() => navigate("/menu")}
                     className="mt-6 px-6 py-2 font-bold bg-orange-500 hover:scale-95 transition rounded-xl shadow-lg"
                  >
                     Order Now
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default FoodBanner;
