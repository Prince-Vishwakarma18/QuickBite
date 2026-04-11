import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";
import { FaLocationDot } from "react-icons/fa6";
import { BsCartDashFill, BsCartPlusFill } from "react-icons/bs";
import { IoMdArrowRoundBack, IoMdStar } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/userSlice";

function FoodDetail() {
   const { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [food, setFood] = useState(null);
   const [loading, setLoading] = useState(true);
   const cartItems = useSelector((state) => state.user.cartItems);
   const authUser = useSelector((state) => state.user.authUser);

   useEffect(() => {
      const fetchFood = async () => {
         try {
            setLoading(true);
            const res = await axiosInstance.get(`/food/${id}`);
            if (res.data.success) setFood(res.data.food);
         } catch {
            toast.error("Failed to load food details.");
         } finally {
            setLoading(false);
         }
      };
      fetchFood();
   }, [id]);

   const handleAddToCart = (food) => {
      if (!authUser) {
         toast.dismiss();
         toast.error("Please Login First!");
         return;
      }
      dispatch(addToCart(food));
   };

   if (loading)
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 gap-4">
            <div className="w-10 h-10 border-4 border-zinc-700 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-zinc-500 text-sm">Loading food details...</p>
         </div>
      );

   const isVeg = food.foodType === "Veg";
   const cartItem = cartItems.find((item) => item._id === id);
   const quantity = cartItem ? cartItem.quantity : 0;

   return (
      <div className="min-h-screen bg-yellow-50 px-3 md:px-4 md:py-8">
         <div className="max-w-4xl mx-auto">
            <button
               onClick={() => navigate(-1)}
               className="flex items-center gap-2 text-black text-sm font-semibold mt-2 mb-2 cursor-pointer"
            >
               <IoMdArrowRoundBack size={28} />
            </button>

            <div className="border border-black/20 flex flex-col md:flex-row bg-white/20 rounded-2xl overflow-hidden">
               {/* Img */}
               <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                  <img
                     src={food.foodImg}
                     alt=""
                     className="w-full h-64 md:h-100 object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div
                     className={`h-7 w-7 absolute left-2 top-2 rounded-2xl border-white border-2 ${
                        isVeg ? "bg-green-500" : "bg-red-500"
                     }`}
                  ></div>
                  <div className="absolute right-2 top-2 flex items-center gap-1 px-3 rounded-2xl text-black bg-white/90 backdrop-blur-sm">
                     <FaStar color="gold" size={18} />
                     {food.averageRating?.toFixed(1)}
                  </div>
               </div>

               <div className="text-black flex-1 px-4 md:px-10 py-5 md:py-0">
                  <div className="flex flex-wrap gap-2 py-4 uppercase">
                     <p className="bg-orange-500/10 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                        {food.category}
                     </p>
                     <p
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                           isVeg
                              ? "bg-yellow-500/10 text-green-400"
                              : "bg-red-500/10 text-red-500"
                        }`}
                     >
                        {food.foodType}
                     </p>
                  </div>

                  <h1 className="text-2xl md:text-5xl font-bold text-black">
                     {food.foodName}
                  </h1>

                  {/* rating */}
                  <div className="flex items-center gap-2 py-3">
                     {[1, 2, 3, 4, 5].map((i) => (
                        <IoMdStar
                           key={i}
                           size={22}
                           className={
                              i <= Math.round(food.averageRating)
                                 ? "text-yellow-400"
                                 : "text-zinc-700"
                           }
                        />
                     ))}
                     <span className="font-bold text-black text-sm">
                        {food.averageRating?.toFixed(1)}
                     </span>
                     <span className="text-zinc-500 text-sm">
                        ({food.ratings.length} rating)
                     </span>
                  </div>

                  {/* price */}
                  <div className="flex items-baseline gap-2 mb-6 border-b border-zinc-800 pb-6">
                     <span className="text-2xl md:text-4xl font-extrabold text-orange-500">
                        ₹{food.price}
                     </span>
                     <span className="text-zinc-500 text-sm">per plate</span>
                  </div>

                  {/* shop card */}
                  <div className="flex gap-3 bg-black/60 p-2 rounded">
                     <img
                        src={food.shop.shopImg}
                        alt=""
                        className="h-12 w-12 object-cover rounded"
                     />
                     <div>
                        <h1 className="font-semibold text-white">
                           {food.shop.shopName}
                        </h1>
                        <h1 className="flex items-center text-zinc-200 text-sm">
                           <FaLocationDot color="red" /> {food.shop.city},{" "}
                           {food.shop.state}
                        </h1>
                     </div>
                  </div>

                  {/* Btn add remove */}
                  <div className="flex items-center justify-between md:justify-start space-x-2 md:space-x-4 px-2 py-4 mt-4 shadow rounded">
                     <button
                        onClick={() => dispatch(removeFromCart(id))}
                        className="flex items-center gap-1 px-4 md:px-5 py-2 bg-orange-500 text-white font-bold rounded"
                     >
                        <BsCartDashFill />
                        Remove
                     </button>
                     <span className="text-lg font-bold text-black">
                        {quantity}
                     </span>
                     <button
                        onClick={() => handleAddToCart(food)}
                        className="flex items-center gap-1 px-6 md:px-9 py-2 bg-orange-500 text-white font-bold rounded"
                     >
                        <BsCartPlusFill />
                        Add
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default FoodDetail;
