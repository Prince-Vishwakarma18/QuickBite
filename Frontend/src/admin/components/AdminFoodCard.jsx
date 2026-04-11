import React from "react";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetAdminFoodList } from "../../hooks/useGetAdminFoodList";
import axiosInstance from "../../services/api";
import toast from "react-hot-toast";

function AdminFoodCard() {
   useGetAdminFoodList();

   const foods = useSelector((state) => state.admin.foods);

   const handleDeleteFood = async (foodId) => {
      const confirmDelete = window.confirm("Delete this item?");
      if (!confirmDelete) return;

      try {
         const res = await axiosInstance.delete(`/food/delete/${foodId}`);
         toast.dismiss();
         toast.success(res.data.message);
      } catch (error) {
         toast.dismiss();
         toast.error(error.response?.data?.message || "Something went wrong");
      }
   };

   return (
      <div className="w-full bg-yellow-50 min-h-screen px-3 sm:px-5 py-4">
         <h1 className="text-center text-xl sm:text-2xl uppercase font-bold text-black mb-6">
            All <span className="text-orange-500">items</span>
         </h1>

         {foods.length === 0 ? (
            <p className="text-center text-zinc-500">No food items available</p>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {foods.map((item) => (
                  <div
                     key={item._id}
                     className="bg-white/10 border border-black/10 rounded-xl p-3 flex gap-3 items-center hover:border-black/20 hover:shadow-md transition"
                  >
                     {/* Img */}
                     <img
                        src={item.foodImg}
                        alt={item.foodName}
                        className="w-16 h-16 rounded-lg object-cover "
                     />

                     {/* Info */}
                     <div className="flex-1">
                        <h2 className="text-sm sm:text-base font-medium text-black line-clamp-1">
                           {item.foodName}
                        </h2>

                        <p className="text-xs text-zinc-500">
                           {item.category} • {item.foodType}
                        </p>

                        <p className="text-green-400 font-semibold text-sm mt-1">
                           ₹{item.price}
                        </p>
                     </div>

                     {/* Delete Btn */}
                     <button
                        onClick={() => handleDeleteFood(item._id)}
                        className="text-red-400 hover:text-red-500 hover:scale-110 transition"
                     >
                        <MdDeleteForever size={22} />
                     </button>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

export default AdminFoodCard;
