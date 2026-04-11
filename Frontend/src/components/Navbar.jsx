import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaBox } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdLogout } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import axiosInstance from "../services/api";
import toast from "react-hot-toast";
import { setAuthUser, setSearch, setUserCity } from "../store/userSlice";
import { socket } from "../socket/socket";

function Navbar({ setDrawerOpen }) {
   const navigate = useNavigate();
   const location = useLocation();
   const dispatch = useDispatch();
   const city = useSelector((state) => state.user.city);
   const authUser = useSelector((state) => state.user.authUser);
   const cartItems = useSelector((state) => state.user.cartItems);
   const [profileOpen, setProfileOpen] = useState(false);
   const showSearch =
      location.pathname === "/" ||
      location.pathname === "/menu" ||
      location.pathname === "/category/Chickeny";

   const handleToggle = () => setProfileOpen((prev) => !prev);
   const handleLogout = async () => {
      try {
         const res = await axiosInstance.post("/auth/signout");
         if (res.data.success) {
            toast.dismiss();
            toast.success(res.data.message || "Logout Successfully");
            dispatch(setAuthUser(null));
            dispatch(setUserCity(null));
            socket.disconnect();
            navigate("/");
         }
      } catch (error) {
         toast.dismiss();
         toast.error(error.response?.data?.message || "Can't Logout");
      }
   };

   return (
      <nav className="w-full bg-yellow-50 border-b border-black/10 shadow sticky top-0 z-50">
         <div className="flex items-center justify-between px-4 md:px-6 h-14 gap-3">
            <div className="flex items-center gap-4">
               <NavLink to="/" className="text-xl font-black tracking-tight">
                  <span className="text-gray-800">Quick</span>
                  <span className="text-orange-500">Bite</span>
               </NavLink>

               {city && (
                  <div className="hidden md:flex items-center gap-1.5 text-sm font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors">
                     <FaLocationDot className="text-orange-500 text-xs" />
                     {city}
                  </div>
               )}
            </div>

            {/* Desktop search */}
            {showSearch && (
               <div className="hidden md:flex flex-1 max-w-xs items-center text-gray-800 gap-2 bg-yellow-50 border border-black/10 rounded-xl px-3 py-2">
                  <IoSearch className="text-zinc-400" />
                  <input
                     onChange={(e) => dispatch(setSearch(e.target.value))}
                     type="text"
                     placeholder="Search food..."
                     className="bg-transparent outline-none text-sm w-full font-semibold text-gray-800 placeholder:text-zinc-500"
                  />
               </div>
            )}

            <div className="flex items-center gap-4">
               <NavLink
                  to="/menu"
                  className={({ isActive }) =>
                     `hidden md:block text-sm font-bold transition-colors ${
                        isActive
                           ? "text-orange-500"
                           : "text-gray-800 hover:text-orange-500"
                     }`
                  }
               >
                  Menu
               </NavLink>
               <NavLink
                  to="/my-orders"
                  className={({ isActive }) =>
                     `hidden md:block text-sm font-bold transition-colors ${
                        isActive
                           ? "text-orange-500"
                           : "text-gray-800 hover:text-orange-500"
                     }`
                  }
               >
                  Orders
               </NavLink>

               {/* Cart */}
               <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                     `relative text-sm font-bold transition-colors ${
                        isActive
                           ? "text-orange-500"
                           : "text-gray-800 hover:text-orange-500"
                     }`
                  }
               >
                  <FaShoppingCart className="text-lg" />
                  {cartItems?.length > 0 && (
                     <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                        {cartItems.length}
                     </span>
                  )}
               </NavLink>

               {/* Acc */}
               {!authUser ? (
                  <button
                     onClick={() => setDrawerOpen(true)}
                     className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl transition-colors"
                  >
                     Sign In
                  </button>
               ) : (
                  <div
                     onClick={handleToggle}
                     className="relative cursor-pointer text-gray-800"
                  >
                     <FaUserAlt className="text-lg hover:text-orange-500 transition-colors" />

                     {profileOpen && (
                        <div className="absolute top-9 right-0 w-44 bg-yellow-50 border border-black/10 rounded-2xl shadow-xl p-1.5 space-y-0.5">
                           {city && (
                              <div className="flex md:hidden items-center gap-2 px-3 py-2 text-sm font-bold text-gray-800">
                                 <FaLocationDot className="text-orange-500 text-xs" />
                                 {city}
                              </div>
                           )}
                           <NavLink
                              to="/menu"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-gray-800 hover:bg-black/10 transition-colors"
                           >
                              <CiMenuBurger className="font-extrabold" />
                              Menu
                           </NavLink>
                           <NavLink
                              to="/my-orders"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-gray-800 hover:bg-black/10  transition-colors"
                           >
                              <FaBox />
                              Orders
                           </NavLink>
                           <div
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-gray-800 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                           >
                              <MdLogout className="text-base" />
                              Logout
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>

         {/* Mobile search */}
         {showSearch && (
            <div className="flex md:hidden px-2 pb-3 bg-yellow-50">
               <div className="flex items-center gap-2 w-full border border-black/10 rounded-xl px-3 py-2">
                  <IoSearch className="text-zinc-400" />
                  <input
                     onChange={(e) => dispatch(setSearch(e.target.value))}
                     type="text"
                     placeholder="Search food..."
                     className="bg-transparent outline-none text-sm w-full font-semibold text-gray-800 placeholder:text-zinc-500"
                  />
               </div>
            </div>
         )}
      </nav>
   );
}

export default Navbar;
