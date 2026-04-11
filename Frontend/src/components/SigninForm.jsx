import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../services/api";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const inputStyle =
   "w-full border text-black  border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors placeholder:text-zinc-500";

function SigninForm({ setOpen }) {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({ email: "", password: "" });

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await axiosInstance.post("/auth/signin", formData);
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
         <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl mt-2 transition-colors disabled:opacity-50"
         >
            {loading ? "Please wait..." : "Login"}
         </button>
      </form>
   );
}

export default SigninForm;
