import React from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CartPage() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const authUser = useSelector((state) => state.user.authUser);
   const cartItems = useSelector((state) => state.user.cartItems);
   const subtotal = cartItems?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
   );
   const deliveryFee = subtotal > 299 ? 0 : 99;
   const total = subtotal + deliveryFee;

   const handleCheckoutBtn = () => {
      if (!authUser) {
         toast.dismiss();
         toast.error("Please login");
         return;
      }
      navigate("/cart/checkout");
   };

   if (!cartItems?.length) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-yellow-50">
            <h2 className="text-xl font-bold mb-3 text-black uppercase">
               Your cart is empty
            </h2>
            <button
               onClick={() => navigate("/")}
               className="bg-orange-500 hover:bg-orange-600 transition-colors px-6 py-2.5 rounded-xl text-White font-semibold shadow-md"
            >
               Go Shopping
            </button>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-yellow-50 p-4">
         <div className="w-full max-w-2xl mx-auto">
            {/* Back btn */}
            <div className="relative flex items-center mb-4">
               <button
                  onClick={() => navigate(-1)}
                  className="absolute left-0 text-black cursor-pointer"
               >
                  <IoArrowBack className="text-2xl" />
               </button>
               <h1 className="w-full text-center text-2xl font-bold text-black">
                  YOUR <span className="text-orange-500">CART</span>
               </h1>
            </div>

            {/* Cart Items */}
            <div className="bg-white/10 border border-black/10 backdrop-blur rounded-2xl  shadow p-4 mb-4 max-h-80 overflow-y-auto space-y-3">
               {cartItems.map((item, index) => (
                  <div
                     key={item._id || index}
                     className="flex items-center gap-4 p-3 rounded-xl "
                  >
                     {/* Img */}
                     <img
                        src={item.foodImg}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        alt={item.foodName}
                     />

                     {/* Info */}
                     <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-zinc-800 truncate text-sm sm:text-base">
                           {item.foodName}
                        </h2>

                        <p className="text-emerald-600 font-semibold mt-0.5">
                           ₹{item.price}
                        </p>
                     </div>

                     {/* Btn*/}
                     <div className="flex items-center gap-2  border border-zinc-200 px-3 py-1.5 rounded-full flex-shrink-0">
                        <button
                           onClick={() => dispatch(removeFromCart(item._id))}
                           className="text-zinc-600 hover:text-rose-500 active:scale-90 transition"
                        >
                           <AiOutlineMinus size={16} />
                        </button>
                        <span className="font-medium text-zinc-800 w-4 text-center text-sm">
                           {item.quantity}
                        </span>
                        <button
                           onClick={() => dispatch(addToCart(item))}
                           className="text-zinc-600 hover:text-emerald-600 active:scale-90 transition"
                        >
                           <FaPlus size={14} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>

            {/* Bill */}
            <div className="bg-white/10 border border-black/10 rounded-2xl shadow-sm p-5 mb-4 space-y-3">
               <h2 className="font-bold text-black text-base">Bill Summary</h2>

               <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">₹{subtotal}</span>
               </div>

               <div className="flex justify-between text-sm text-zinc-400">
                  <span>Delivery Fee</span>
                  <span
                     className={`font-semibold ${deliveryFee === 0 ? "text-green-400" : "text-black"}`}
                  >
                     {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
               </div>

               <div className="flex justify-between font-bold text-black border-t border-dashed border-zinc-700 pt-3">
                  <span>Total</span>
                  <span className="text-orange-500">₹{total}</span>
               </div>
            </div>

            {/* Checkout Btn */}
            <button
               onClick={handleCheckoutBtn}
               disabled={!cartItems.length}
               className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all py-3.5 rounded-2xl font-bold text-white text-base shadow-lg shadow-orange-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               Proceed to Checkout
            </button>
         </div>
      </div>
   );
}

export default CartPage;
