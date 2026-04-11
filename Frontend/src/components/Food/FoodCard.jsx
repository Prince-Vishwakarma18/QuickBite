import React, { useEffect } from "react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { MdStore } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

function FoodCard({ item, quantity = 0, onAdd, onRemove, foodType }) {
   if (!item) return null;
   const navigate = useNavigate();

   const authUser = useSelector((state) => state.user.authUser);
   const error = useSelector((state) => state.user.error);

   useEffect(() => {
      if (error) {
         toast.dismiss();
         toast.error(error.message);
      }
   }, [error]);

   const handleAddToCart = () => {
      if (!authUser) {
         toast.dismiss();
         toast.error("Please Login First!");
         return;
      }
      onAdd(item);
   };

   return (
      <div className="bg-white/10 text-gray-800 border-gray-300 border  rounded-2xl overflow-hidden shadow shadow-black/20">
         {/* Img */}
         <div className="relative h-28 overflow-hidden">
            <img
               onClick={() => navigate(`/food/${item._id}`)}
               src={item.foodImg}
               alt={item.foodName}
               className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
            />

            {item?.totalRatings > 0 && (
               <div className="absolute top-1 right-1 bg-white/50 px-1 py-0.5 rounded flex items-center gap-1 shadow">
                  <FaStar className="text-yellow-400 text-xs" />
                  <span className="text-xs  text-black font-bold">
                     {item?.averageRating?.toFixed(1)}
                  </span>
               </div>
            )}

            <div
               className={`absolute top-1 left-2 p-1.5 rounded-full border-white border-2 ${
                  foodType === "Veg" ? "bg-green-500" : "bg-red-600"
               }`}
            ></div>
         </div>

         {/* food det */}
         <div className="p-2">
            <h2 className="font-bold text-sm truncate">{item.foodName}</h2>

            <div className="flex items-center gap-1 text-xs mt-1 text-zinc-800">
               <MdStore />
               {item?.shop?.shopName}
            </div>
            {/* Btn */}
            <div className="flex justify-between items-center mt-2 font-bold">
               <span className="text-green-400">₹{item.price}</span>
               <div className="flex items-center gap-2 border-black/10 border px-3 py-1 rounded-full w-fit">
                  <FiMinusCircle
                     className="cursor-pointer text-zinc-700 hover:text-rose-500 transition"
                     size={20}
                     onClick={() => onRemove(item._id)}
                  />
                  <span className="text-sm font-medium text-zinc-800 text-center">
                     {quantity}
                  </span>
                  <FiPlusCircle
                     className="cursor-pointer text-zinc-700  hover:text-emerald-600 transition"
                     size={20}
                     onClick={handleAddToCart}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

export default FoodCard;
