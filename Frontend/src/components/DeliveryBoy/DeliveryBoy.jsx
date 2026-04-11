import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../services/api";
import DeliveryBoyTrack from "./DeliveryBoyTrack";
import toast from "react-hot-toast";
import AvailabaleOrder from "./AvailabaleOrder";
import { useDispatch, useSelector } from "react-redux";
import { setActiveOrder } from "../../store/mapSlice";

function DeliveryBoy() {
   const dispatch = useDispatch();
   const [otpToggle, setOtpToggle] = useState(false);
   const activeOrder = useSelector((state) => state.map.activeOrder);
   const [loading, setLoading] = useState(true);
   const [sendingOtp, setSendingOtp] = useState(false);
   const [otp, setOTP] = useState(["", "", "", ""]);

   const fetchActiveOrder = useCallback(async () => {
      try {
         const res = await axiosInstance.get("/order/active-order");

         if (res.data.order) {
            dispatch(setActiveOrder(res.data.order));
         } else {
            dispatch(setActiveOrder(null));
         }
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   }, [dispatch]);

   useEffect(() => {
      fetchActiveOrder();
   }, [fetchActiveOrder]);

   // Send otp
   const handleSendOtp = async () => {
      if (!activeOrder) return;

      try {
         setSendingOtp(true);

         const res = await axiosInstance.post("/order/send-otp", {
            orderId: activeOrder._id,
         });
         toast.dismiss();
         toast.success(res.data.message);
         setOtpToggle(true);
      } catch (error) {
         toast.dismiss();
         toast.error("Failed to send OTP");
      } finally {
         setSendingOtp(false);
      }
   };

   // OTP INPUT
   const handleOtpChange = (value, index) => {
      if (!/^\d?$/.test(value)) return;

      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
   };

   // Verify otp
   const verifyOTP = async () => {
      const finalOTP = otp.join("");

      if (finalOTP.length !== 4) {
         toast.error("Enter complete OTP");
         return;
      }

      try {
         const res = await axiosInstance.post("/order/verify-otp", {
            orderId: activeOrder._id,
            otp: finalOTP,
         });
         toast.dismiss();
         toast.success(res.data.message);

         dispatch(setActiveOrder(null));
         setOtpToggle(false);
         setOTP(["", "", "", ""]);
      } catch (error) {
         toast.dismiss();
         toast.error("Invalid OTP");
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 gap-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-orange-400 font-medium tracking-wide">
               Loading your orders...
            </p>
         </div>
      );
   }
   return (
      <div className="min-h-screen bg-yellow-50 text-black flex flex-col">
         <main className="flex justify-center">
            <div className="w-full space-y-6">
               {activeOrder && (
                  <div className="bg-white/10 w-full rounded-xl shadow p-4 space-y-4 border border-black/10">
                     <h2 className="text-xl text-center font-extrabold uppercase">Active <span className="text-orange-500">Delivery</span></h2>
                     <div className=" text-black shadow shadow-white/15 border border-black/10 rounded-xl p-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                           <img
                              src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                              className="h-10 w-10 text-black rounded-2xl"
                              alt="customer"
                           />

                           <div>
                              <p className="font-semibold text-black">
                                 {activeOrder?.user?.fullName}
                              </p>

                              <p className="text-sm text-gray-500">
                                 {activeOrder?.user?.mobileNumber}
                              </p>

                              <p className="text-xs text-black mt-1 max-w-xs">
                                 {activeOrder?.deliveryAdd?.text}
                              </p>
                           </div>
                        </div>

                        {activeOrder.items?.map((item, index) => (
                           <div
                              key={index}
                              className="flex items-center text-black gap-3"
                           >
                              <img
                                 src={item.foodImg}
                                 className="h-14 w-14 rounded-lg object-cover"
                                 alt="food"
                              />

                              <div>
                                 <p className="font-semibold">{item.name}</p>

                                 <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                 </p>
                              </div>
                           </div>
                        ))}

                        <div className="border md:border-none rounded-xl">
                           <h1 className="text-center text-gray-500 text-sm font-medium">
                              Total Amount
                           </h1>

                           <h1 className="text-lg text-center font-bold text-green-600">
                              ₹{activeOrder?.totalAmount}
                           </h1>
                        </div>
                     </div>

                     <div className="h-80 relative rounded-lg overflow-hidden border z-0 ">
                        <DeliveryBoyTrack order={activeOrder} />
                     </div>

                     {otpToggle && (
                        <div className="w-full flex items-center justify-center border border-white/10 rounded-xl shadow-md p-5 space-y-2">
                           <div className="flex gap-3">
                              {otp.map((value, index) => (
                                 <input
                                    key={index}
                                    value={value}
                                    onChange={(e) =>
                                       handleOtpChange(e.target.value, index)
                                    }
                                    maxLength={1}
                                    className=" h-8 w-8 sm:w-12 sm:h-12 border rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                                 />
                              ))}

                              <button
                                 onClick={verifyOTP}
                                 className="py-2 px-8 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition"
                              >
                                 Verify
                              </button>
                           </div>
                        </div>
                     )}

                     <button
                        onClick={handleSendOtp}
                        disabled={sendingOtp}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
                     >
                        {sendingOtp
                           ? "Sending OTP..."
                           : otpToggle
                             ? "OTP Sent"
                             : "Mark as Delivered"}
                     </button>
                  </div>
               )}

               <AvailabaleOrder />
            </div>
         </main>
      </div>
   );
}

export default DeliveryBoy;
