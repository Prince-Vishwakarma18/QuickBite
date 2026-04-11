import React from "react";
import NoShopFound from "../components/NoShopFound";
import { IoArrowBack } from "react-icons/io5";
import FoodMenu from "../components/Food/FoodMenu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MenuPage() {
   const navigate = useNavigate();
   const shops = useSelector((state) => state.user.shopsInMyCity);
   if (!shops || shops.length === 0) return <NoShopFound />;
   return (
      <div className="px-1">
         <div className="relative flex items-center mb-4 font-bold">
            <button
               onClick={() => navigate(-1)}
               className="absolute left-2 text-black"
            >
               {" "}
               <IoArrowBack className="text-2xl" />{" "}
            </button>
            <h1 className="w-full text-center text-2xl font-bold text-black uppercase md:py-2">
               Explore <span className="text-orange-500">Menu</span>{" "}
            </h1>
         </div>
         <FoodMenu />
      </div>
   );
}

export default MenuPage;
