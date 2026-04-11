import React, { useState } from "react";
import { MdDeliveryDining } from "react-icons/md";
import { FaBox, FaUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser, setUserCity } from "../../store/userSlice";
import { socket } from "../../socket/socket";

function Navbar() {
   const [toggle, setToggle] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleLogout = async () => {
      try {
         const res = await axiosInstance.post("/auth/signout");

         if (res.data.success) {
            toast.dismiss();
            toast.success(res.data.message || "Logout Successfully");
            socket.disconnect();
            dispatch(setAuthUser(null));
            dispatch(setUserCity(null));
            setToggle(false);
            navigate("/");
         }
      } catch (error) {
         toast.dismiss();
         toast.error(error.response?.data?.message || "Can't Logout");
      }
   };

   return (
      <nav className="bg-yellow-50 border-b border-black/10 shadow shadow-black/10 sticky top-0 z-10">
         <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer">
               <div className="bg-orange-500 p-2 rounded-xl shadow-md">
                  <MdDeliveryDining size={28} color="white" />
               </div>

               <div className="leading-tight">
                  <h1 className="text-lg font-extrabold -mb-2 text-black tracking-tight">
                     QuickBite
                  </h1>
                  <span className="text-[11px] font-semibold text-orange-500 tracking-wider">
                     FAST DELIVERY
                  </span>
               </div>
            </div>

            {/* Acc */}
            <div className="relative">
               <div
                  onClick={() => setToggle(!toggle)}
                  className="flex items-center gap-2 bg-orange-500 px-3 py-1.5 rounded-full shadow-md cursor-pointer hover:shadow-lg transition"
               >
                  <FaUserCircle size={24} className="text-white" />
                  <span className="text-white text-sm font-medium hidden sm:block">
                     Account
                  </span>
               </div>

               {/* Dropdown */}
               <div
                  className={`absolute right-0 mt-3 w-48 bg-yellow-50 rounded-xl overflow-hidden shadow-xl border transition-all duration-200 origin-top ${
                     toggle
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-0 pointer-events-none"
                  }`}
               >
                  <Link
                     onClick={() => setToggle(false)}
                     to="/delivery/my-orders"
                     className="flex items-center gap-2 px-4 py-2 text-sm text-black hover:text-black/80 hover:text-orange-500 transition"
                  >
                     <FaBox /> My Orders
                  </Link>

                  <button
                     onClick={handleLogout}
                     className="w-full flex items-center gap-2  cursor-pointer text-black text-left px-4 py-2 text-sm hover:text-black/80 hover:text-red-500 transition"
                  >
                     <CiLogout size={18} /> Logout
                  </button>
               </div>
            </div>
         </div>
      </nav>
   );
}

export default Navbar;
