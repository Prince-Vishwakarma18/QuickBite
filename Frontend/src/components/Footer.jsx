import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { IoMdHome, IoIosMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
function Footer() {
   const navigate = useNavigate();
   return (
      <footer className="bg-gray-900 text-gray-800 px-6 py-10 shadow shadow-white ">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* Logo */}
            <div className="flex flex-col gap-3">
               <h1 className="text-2xl text-white font">
                  Quick<span className="text-orange-500">Bite</span>
               </h1>
               <p className="text-sm text-gray-400 leading-relaxed">
                  Craving something delicious? We deliver hot, fresh meals from
                  your favourite local restaurants straight to your door — fast.
               </p>
               <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FaLocationDot color="red" />
                  <span>Lucknow, Uttar Pradesh</span>
               </div>
            </div>

            {/* Linkss */}
            <div className="flex flex-col gap-3">
               <h2 className="text-lg font-bold text-orange-500 uppercase tracking-widest">
                  Quick Links
               </h2>
               <ul className="flex flex-col gap-2 text-sm text-gray-300">
                  <li
                     onClick={() => navigate("/")}
                     className="flex items-center gap-2 cursor-pointer"
                  >
                     <IoMdHome />
                     Home
                  </li>
                  <li
                     onClick={() => navigate("/menu")}
                     className="flex items-center gap-2 cursor-pointer"
                  >
                     <MdRestaurantMenu color="green" /> Menu
                  </li>
                  <li
                     onClick={() => navigate("/my-orders")}
                     className="flex items-center gap-2 cursor-pointer"
                  >
                     <FaBox color="brown" /> Orders
                  </li>
               </ul>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-3">
               <h2 className="text-lg font-bold text-orange-500 uppercase tracking-widest">
                  Follow Us
               </h2>
               <ul className="flex flex-col gap-3 text-sm text-gray-300">
                  <li>
                     <a
                        className="flex items-center gap-2 cursor-pointer"
                        href="https://www.instagram.com/_.prince_panchal._?igsh=MXdrZzZhbDQyYmdjdA=="
                     >
                        <FaInstagram size={18} color="red" /> Instagram
                     </a>
                  </li>
                  <li>
                     <a
                        className="flex items-center gap-2 cursor-pointer"
                        href="https://www.facebook.com/share/1GfsQQSJMp/"
                     >
                        {" "}
                        <FaFacebook size={18} color="blue" /> Facebook
                     </a>
                  </li>
                  <li>
                     <a
                        className="flex items-center gap-2 cursor-pointer"
                        href=""
                     >
                        <FaTwitter size={18} color="lime" /> Twitter
                     </a>
                  </li>
               </ul>
            </div>
            {/* Contact */}
            <div className="flex flex-col gap-3">
               <h2 className="text-lg font-bold text-orange-500 uppercase tracking-widest">
                  Contact Us
               </h2>
               <ul className="flex flex-col gap-3 text-sm text-gray-300">
                  <li className="flex items-center gap-2 cursor-pointer">
                     <IoCall color="red" /> +91 9651439979
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer">
                     <IoCall color="red" /> +91 8881146179
                  </li>
                  <li className="flex items-center gap-2">
                     <IoIosMail size={18} color="orange" /> support@quickbite.in
                  </li>
               </ul>
            </div>
         </div>

         <div className="border-t border-gray-800 mt-10 pt-5 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} QuickBite. All rights reserved. Made
            with ❤️ in India.
         </div>
      </footer>
   );
}

export default Footer;
