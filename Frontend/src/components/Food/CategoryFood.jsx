import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../services/api";
import { addToCart, removeFromCart } from "../../store/userSlice";
import FoodCard from "./FoodCard";
import { IoMdArrowBack } from "react-icons/io";
import { IoFastFoodSharp } from "react-icons/io5";
import NoShopFound from "../NoShopFound";

function CategoryFood() {
   const { id } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const cartItems = useSelector((state) => state.user.cartItems);
   const shops = useSelector((state) => state.user.shopsInMyCity);

   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(false);
   const [visible, setVisible] = useState(9);

   useEffect(() => {
      const fetchFoods = async () => {
         try {
            setLoading(true);
            const res = await axiosInstance.get(`/food/category/${id}`);
            setItems(res.data.foods || []);
         } catch (err) {
            console.log("Error categoryfood");
         } finally {
            setLoading(false);
         }
      };
      fetchFoods();
   }, [id]);

   if (loading)
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 gap-4">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-black text-sm">Loading food details...</p>
         </div>
      );
   if (!shops || shops.length === 0) return <NoShopFound />;

   return (
      <div className="px-3 pb-3 bg-yellow-50 min-h-screen">
         <div className="relative flex items-center py-4">
            <button
               onClick={() => navigate(-1)}
               className="absolute left-0 text-black font-bold cursor-pointer"
            >
               <IoMdArrowBack className="text-2xl" />
            </button>
            <h1 className="w-full text-center text-xl font-bold text-black uppercase">
               Explore <span className="text-orange-500">{id}</span>
            </h1>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.length === 0 ? (
               <div className="col-span-full flex flex-col items-center justify-center min-h-80 gap-3">
                  <span className="text-6xl text-orange-500">
                     <IoFastFoodSharp />
                  </span>
                  <p className="text-sm font-bold text-black uppercase">
                     No food available right now
                  </p>
                  <p className="text-sm text-zinc-500">
                     Please check back later.
                  </p>
               </div>
            ) : (
               items.slice(0, visible).map((item) => {
                  const cartItem = cartItems.find((i) => i._id === item._id);
                  const quantity = cartItem ? cartItem.quantity : 0;
                  return (
                     <FoodCard
                        key={item._id}
                        item={item}
                        quantity={quantity}
                        onAdd={(item) => dispatch(addToCart(item))}
                        onRemove={(id) => dispatch(removeFromCart(id))}
                     />
                  );
               })
            )}
         </div>

         {items.length > 9 && (
            <div className="flex justify-center mt-5">
               <button
                  onClick={() =>
                     setVisible((prev) => (prev >= items.length ? 9 : prev + 9))
                  }
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm px-7 py-2.5 rounded-xl transition-colors"
               >
                  {visible >= items.length ? "See Less" : "See More"}
               </button>
            </div>
         )}
      </div>
   );
}

export default CategoryFood;
