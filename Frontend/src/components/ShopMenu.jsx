import React, { useEffect, useState } from "react";
import { FaShop } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../store/userSlice";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";
import FoodCard from "./Food/FoodCard";

function ShopMenu() {
   const { id } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const [shopFoods, setShopFoods] = useState([]);
   const cartItems = useSelector((state) => state.user.cartItems);
   const [visible, setVisible] = useState(9);

   useEffect(() => {
      const fetchFoods = async () => {
         try {
            const res = await axiosInstance.post(`/food/shop-foods/${id}`);
            setShopFoods(res.data.foods || []);
         } catch (error) {
            console.error("Error fetching shop foods:", error);
         }
      };
      if (id) fetchFoods();
   }, [id]);

   const handleAdd = (product) => {
      if (
         cartItems.length > 0 &&
         cartItems[0]?.shop?._id !== product?.shop?._id
      ) {
         toast.dismiss();
         toast.error(
            "Cart contains items from another shop. Please clear cart first.",
         );
         return;
      }
      dispatch(addToCart(product));
   };

   return (
      <div className="bg-yellow-50 min-h-screen p-2 ">
         {/* Shop  */}
         <div className="relative h-64 w-full overflow-hidden rounded border border-white/40">
            <button
               onClick={() => navigate(-1)}
               className="absolute top-2 left-2 z-10 cursor-pointer text-black/60 bg-black/60 p-1 rounded-full shadow"
            >
               <IoMdArrowRoundBack color="white" size={20} />
            </button>

            <img
               className="w-full h-full object-cover"
               src={shopFoods[0]?.shop?.shopImg}
            />

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
               <h1>
                  <FaShop color="orange" size={30} />
               </h1>
               <h1 className="text-2xl font-extrabold">
                  {shopFoods[0]?.shop?.shopName}
               </h1>
               <p className="text-sm">{shopFoods[0]?.shop?.address}</p>
               <p className="text-sm">
                  {shopFoods[0]?.shop?.city}, {shopFoods[0]?.shop?.state}
               </p>
            </div>
         </div>
         <h1 className="text-center text-md sm:text-2xl py-3 uppercase font-extrabold text-black">
            {shopFoods[0]?.shop?.shopName}{" "}
            <span className="text-orange-500">Menu</span>
         </h1>
         {/* Foods */}
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 py-2 px-2">
            {shopFoods.slice(0, visible).map((item) => {
               const cartItem = cartItems.find((i) => i._id === item._id);
               const quantity = cartItem ? cartItem.quantity : 0;
               return (
                  <FoodCard
                     key={item._id}
                     item={item}
                     quantity={quantity}
                     onAdd={(item) => handleAdd(item)}
                     onRemove={(id) => dispatch(removeFromCart(id))}
                     id={item._id}
                  />
               );
            })}
         </div>

         {shopFoods.length > 9 && (
            <div className="flex justify-center mt-2 py-5 ">
               <button
                  onClick={() =>
                     setVisible((prev) =>
                        prev >= shopFoods.length ? 9 : prev + 9,
                     )
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-7 py-2.5 rounded-xl transition-colors"
               >
                  {visible >= shopFoods.length ? "See Less" : "See More"}
               </button>
            </div>
         )}
      </div>
   );
}

export default ShopMenu;
