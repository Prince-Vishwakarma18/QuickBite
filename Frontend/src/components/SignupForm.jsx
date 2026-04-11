import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../services/api";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const inputStyle =
   "w-full border text-black  border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500";

const initialState = {
   fullName: "",
   email: "",
   mobileNumber: "",
   password: "",
   confirmPassword: "",
   role: "user",
};

function SignupForm({ setOpen }) {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState(initialState);
   const [otpSent, setOtpSent] = useState(false);
   const [otp, setOtp] = useState("");

   const handleSendOtp = async () => {
      if (!formData.email) return toast.error("Enter email first");
      setLoading(true);
      try {
         const res = await axiosInstance.post("/auth/send-otp", {
            email: formData.email,
         });
         if (res.data.success) {
            toast.success("OTP sent to email!");
            setOtpSent(true);
         }
      } catch (error) {
         toast.dismiss();
         toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         return toast.error("Passwords do not match");
      }
      setLoading(true);
      try {
         const res = await axiosInstance.post("/auth/signup", {
            ...formData,
            otp,
         });
         if (res.data.success) {
            dispatch(setAuthUser(res.data.user));
            toast.dismiss();
            toast.success(res.data.message);
            if (res.data.user.role === "admin") navigate("/admin");
            else if (res.data.user.role === "delivery")
               navigate("/delivery-boy");
            else navigate("/");
            setOpen(false);
         }
      } catch (error) {
         toast.dismiss();
         toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
         <input
            value={formData.fullName}
            onChange={(e) =>
               setFormData({ ...formData, fullName: e.target.value })
            }
            type="text"
            placeholder="Full name"
            className={inputStyle}
            required
         />
         <input
            value={formData.mobileNumber}
            onChange={(e) =>
               setFormData({ ...formData, mobileNumber: e.target.value })
            }
            type="tel"
            placeholder="Mobile number"
            className={inputStyle}
            required
         />
         <input
            value={formData.email}
            onChange={(e) =>
               setFormData({ ...formData, email: e.target.value })
            }
            type="email"
            placeholder="Email address"
            className={inputStyle}
            required
         />
         <input
            value={formData.password}
            onChange={(e) =>
               setFormData({ ...formData, password: e.target.value })
            }
            type="password"
            placeholder="Password"
            className={inputStyle}
            required
         />
         <input
            value={formData.confirmPassword}
            onChange={(e) =>
               setFormData({ ...formData, confirmPassword: e.target.value })
            }
            type="password"
            placeholder="Confirm password"
            className={inputStyle}
            required
         />
         <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className={inputStyle}
         >
            <option className="bg-yellow-50" value="user">
               User
            </option>
            <option className="bg-yellow-50" value="admin">
               Admin
            </option>
            <option className="bg-yellow-50" value="delivery">
               Delivery Boy
            </option>
         </select>

         {/* OTP */}
         {!otpSent ? (
            <button
               type="button"
               onClick={handleSendOtp}
               disabled={loading}
               className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
               {loading ? "Sending OTP..." : "Send OTP"}
            </button>
         ) : (
            <div className="flex gap-2 items-center">
               <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={4}
                  className={inputStyle}
                  required
               />
               <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-sm text-orange-500 font-bold whitespace-nowrap"
               >
                  Resend
               </button>
            </div>
         )}

         {otpSent && (
            <button
               type="submit"
               disabled={loading}
               className="bg-red-500 hover:bg-red-600 text-black font-bold py-3 rounded-xl mt-2 transition-colors disabled:opacity-50"
            >
               {loading ? "Please wait..." : "Create Account"}
            </button>
         )}
      </form>
   );
}

export default SignupForm;
