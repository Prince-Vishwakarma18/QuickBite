import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../store/userSlice";
import FoodCard from "./FoodCard";
import { IoFastFoodSharp } from "react-icons/io5";

function FoodMenu() {
   const dispatch = useDispatch();
   const foodByCity = useSelector((state) => state.food.foodByCity) || [];
   const cartItems = useSelector((state) => state.user.cartItems);
   const search = useSelector((state) => state.user.search);
   const [visible, setVisible] = useState(10);
   const filteredFood = foodByCity.filter((item) =>
      item.foodName?.toLowerCase().includes(search?.toLowerCase()),
   );

   return (
      <div className="py-2 min-h-screen">
         {filteredFood.length === 0 ? (
            <div className=" flex flex-col items-center justify-center min-h-80 gap-3">
               <span className="text-6xl text-orange-500">
                  <IoFastFoodSharp />
               </span>
               <p className="text-sm -mb-3 font-bold text-black uppercase">
                  No food found right now
               </p>
            </div>
         ) : (
            <div>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredFood.slice(0, visible).map((item) => {
                     const cartItem = cartItems.find((i) => i._id === item._id);
                     const quantity = cartItem ? cartItem.quantity : 0;

                     return (
                        <FoodCard
                           foodType={item.foodType}
                           key={item._id}
                           item={item}
                           quantity={quantity}
                           onAdd={(item) => dispatch(addToCart(item))}
                           onRemove={(id) => dispatch(removeFromCart(id))}
                        />
                     );
                  })}
               </div>

               {/* See More Btn */}
               {filteredFood.length > 10 && (
                  <div className="flex justify-center mt-5">
                     <button
                        onClick={() =>
                           setVisible((prev) =>
                              prev >= filteredFood.length ? 10 : prev + 10,
                           )
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition"
                     >
                        {visible >= filteredFood.length
                           ? "See Less"
                           : "See More"}
                     </button>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}

export default FoodMenu;
