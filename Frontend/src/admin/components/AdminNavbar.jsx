import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdLogout } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import axiosInstance from "../../services/api";
import toast from "react-hot-toast";
import { setAuthUser, setUserCity } from "../../store/userSlice";
import { TiThMenu } from "react-icons/ti";
import { socket } from "../../socket/socket";

function AdminNavbar() {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [profileOpen, setProfileOpen] = useState(false);

   const handleToggle = () => {
      setProfileOpen((prev) => !prev);
   };

   const handleLogout = async () => {
      try {
         const res = await axiosInstance.post("/auth/signout");
         if (res.data.success) {
            toast.dismiss();
            toast.success("Logout Successfully");
            dispatch(setAuthUser(null));
            dispatch(setUserCity(null));
            socket.disconnect();
            navigate("/");
         }
      } catch (error) {
         toast.dismiss();
         toast.error("Can't Logout");
      }
   };

   return (
      <nav className="w-full bg-yellow-50 border-b border-black/10 shadow sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between">
         <NavLink
            to="/admin"
            className="text-xl sm:text-2xl font-bold text-black hover:opacity-80 transition"
         >
            Quick<span className="text-orange-500">Bite</span>
         </NavLink>
         <div className="flex items-center gap-4 sm:gap-6">
            <NavLink
               to="/admin/add-product"
               className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
            >
               <IoMdAddCircleOutline className="text-lg" />
               <span className="hidden md:block">Add Product</span>
            </NavLink>

            {/* Profile */}
            <div className="relative">
               <FaUserAlt
                  onClick={handleToggle}
                  className="text-lg text-gray-800 cursor-pointer hover:text-black transition"
               />
               {profileOpen && (
                  <div className="absolute right-0 mt-4 w-44 bg-yellow-50 border border-black/10 rounded-xl shadow-lg p-2 space-y-1">
                     <div
                        onClick={() => {
                           setProfileOpen(false);
                           navigate("/admin/orders");
                        }}
                        className="flex items-center gap-2 text-sm text-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/10 transition"
                     >
                        <TiThMenu />
                        My Orders
                     </div>

                     <div
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-red-400 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/10 transition"
                     >
                        <MdLogout className="text-lg" />
                        Logout
                     </div>
                  </div>
               )}
            </div>
         </div>
      </nav>
   );
}

export default AdminNavbar;
