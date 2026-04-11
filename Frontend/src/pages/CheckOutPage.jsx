import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaLocationCrosshairs, FaLocationDot } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import Map from "../components/Map";
import { useDispatch, useSelector } from "react-redux";
import { setMapLocation } from "../store/mapSlice";
import { FaMobileAlt } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import axiosInstance from "../services/api";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../store/userSlice";
import { IoArrowBack } from "react-icons/io5";
import useLocationSearch from "../hooks/useLocationSearch";
import toast from "react-hot-toast";

function CheckOutPage() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useSelector((state) => state.map.location);
   const cartItems = useSelector((state) => state.user.cartItems);
   const authUser = useSelector((state) => state.user.authUser);

   const [paymentMethod, setPaymentMethod] = useState("COD");
   const [loading, setLoading] = useState(false);

   // useLocationSearch hook
   const {
      searchText,
      setSearchText,
      loading: locationLoading,
      handleSearch,
      handleCurrentLocation,
   } = useLocationSearch(({ address, city, latitude, longitude }) => {
      dispatch(
         setMapLocation({
            latitude,
            longitude,
            address,
            city,
         }),
      );
   });

   const isLoading = loading || locationLoading;

   const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
   );
   const deliveryFee = subtotal > 299 ? 0 : 99;
   const total = subtotal + deliveryFee;

   const handlePlaceOrder = async () => {
      if (!authUser) {
         toast.dismiss();
         toast.error("Please login");
         return;
      }
      if (!location?.city) {
         toast.dismiss();
         toast.error("Please select delivery location");
      }
      if (!cartItems.length) {
         toast.dismiss();
         toast.error("Cart is empty");
         return;
      }
      try {
         const res = await axiosInstance.post("/order/placed", {
            paymentMethod,
            deliveryAdd: {
               text: location.address,
               latitude: location.latitude,
               longitude: location.longitude,
               city: location.city,
            },
            items: cartItems,
         });
         if (paymentMethod === "COD") {
            toast.success("Order placed successfully");
            dispatch(clearCart());
            navigate("/my-orders");
         } else {
            openRazorPayWindow(res.data);
         }
      } catch (error) {
         toast.dismiss();
         toast.error(error.response?.data?.message || "Failed to place order");
      }
   };

   // razorpay window
   const openRazorPayWindow = (orderData) => {
      const options = {
         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
         amount: orderData.razorpayOrder.amount,
         currency: "INR",
         name: "QuickBite",
         description: "Food delivery website",
         order_id: orderData.razorpayOrder.id,
         handler: async (response) => {
            try {
               await axiosInstance.post("/order/verify-payment", {
                  razorpay_payment_id: response.razorpay_payment_id,
                  items: orderData.orderItems,
                  subtotal: orderData.subtotal,
                  deliveryFee: orderData.deliveryFee,
                  totalAmount: orderData.totalAmount,
                  shopId: orderData.shopId,
                  deliveryAdd: orderData.deliveryAdd,
               });
               toast.dismiss();
               toast.success("Payment successful ");
               dispatch(clearCart());
               navigate("/my-orders");
            } catch {
               toast.dismiss();
               toast.error("Payment verification failed");
            }
         },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
   };

   return (
      <div className="min-h-screen bg-yellow-50 flex justify-center py-6 px-4">
         <div className="bg-white/10 border border-black/10 text-zinc-400 w-full max-w-2xl p-6 rounded-2xl shadow-sm space-y-6">
            {/* Delivery location */}
            <div className="space-y-3 ">
               <div className="relative flex items-center mb-4">
                  <button
                     onClick={() => navigate(-1)}
                     className="absolute left-0 text-black cursor-pointer"
                  >
                     {" "}
                     <IoArrowBack className="text-2xl" />
                  </button>
                  <h2 className=" w-full flex items-center justify-center font-bold text-black text-lg">
                     {" "}
                     <FaLocationDot color="red" /> Delivery Location
                  </h2>
               </div>

               <div className="flex gap-2">
                  <input
                     type="search"
                     value={searchText}
                     onChange={(e) => setSearchText(e.target.value)}
                     placeholder="Search your address..."
                     className="w-full px-4 py-2.5 text-black border border-gray-200 rounded-xl outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition text-sm"
                  />
                  <button
                     onClick={handleSearch}
                     disabled={isLoading}
                     className="bg-orange-500 hover:bg-orange-600 px-4 rounded-xl text-white transition disabled:opacity-50"
                  >
                     <CiSearch className="text-2xl" />
                  </button>
                  <button
                     onClick={handleCurrentLocation}
                     disabled={isLoading}
                     className="bg-blue-500 hover:bg-blue-600 px-4 rounded-xl text-white transition disabled:opacity-50"
                  >
                     <FaLocationCrosshairs className="text-xl" />
                  </button>
               </div>
               {/* Map */}
               <div className="h-60 relative z-0 rounded-xl overflow-hidden border border-gray-200">
                  <Map lat={location?.latitude} lon={location?.longitude} />
               </div>

               {location?.address && (
                  <p className="text-sm flex items-center gap-2 text-gray-500 px-3 py-2 rounded-lg">
                     <FaLocationDot color="red" /> {location.address}
                  </p>
               )}
            </div>

            {/* Payment */}
            <div className="space-y-3">
               <h2 className="font-bold text-black text-lg">Payment Method</h2>
               <div className="flex flex-col sm:flex-row gap-3">
                  <div
                     onClick={() => setPaymentMethod("COD")}
                     className={`flex-1 flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${
                        paymentMethod === "COD"
                           ? "border-green-400 bg-yellow-50 shadow-sm"
                           : "border-gray-200 hover:border-gray-300"
                     }`}
                  >
                     <span className="text-black-200 text-green-600 p-2 rounded-full text-xl">
                        <MdDeliveryDining />
                     </span>
                     <div className="flex flex-col">
                        <span className="font-semibold text-sm text-black">
                           Cash On Delivery
                        </span>
                        <span className="text-xs text-black">
                           Pay when food arrives
                        </span>
                     </div>
                  </div>

                  <div
                     onClick={() => setPaymentMethod("ONLINE")}
                     className={`flex-1 flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${
                        paymentMethod === "ONLINE"
                           ? "border-blue-400 bg-blue-50 shadow-sm"
                           : "border-gray-200 hover:border-gray-300"
                     }`}
                  >
                     <span className="bg-violet-100 text-violet-600 p-2 rounded-full text-xl">
                        <FaMobileAlt />
                     </span>
                     <span className="bg-amber-100 text-amber-600 p-2 rounded-full text-xl">
                        <FaRegCreditCard />
                     </span>
                     <div className="flex flex-col">
                        <span className="font-semibold text-sm text-black">
                           UPI / Card
                        </span>
                        <span className="text-xs text-gray-500">
                           Pay securely online
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Order */}
            <div className="bg-yellow-50 rounded-xl p-4 space-y-2.5">
               <h2 className="font-bold text-black text-base">Order Summary</h2>
               <div className="flex justify-between text-sm text-black">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">₹{subtotal}</span>
               </div>
               <div className="flex justify-between text-sm text-black">
                  <span>Delivery Fee</span>
                  <span
                     className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-black"}`}
                  >
                     {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                  </span>
               </div>
               <div className="flex justify-between font-bold text-black border-t border-dashed border-gray-300 pt-2.5">
                  <span>Total</span>
                  <span className="text-green-600">₹{total}</span>
               </div>
            </div>

            {/* Place btn */}
            <button
               onClick={handlePlaceOrder}
               className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white py-3.5 rounded-xl font-bold text-base  shadow-green-200"
            >
               Place Order
            </button>
         </div>
      </div>
   );
}

export default CheckOutPage;
