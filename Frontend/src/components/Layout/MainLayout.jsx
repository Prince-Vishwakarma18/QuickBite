import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import AuthDrawer from "../AuthDrawer";
import { socket } from "../../socket/socket";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Footer from "../Footer";

function MainLayout() {
   const [drawerOpen, setDrawerOpen] = useState(false);
   const authUser = useSelector((state) => state.user.authUser);

   useEffect(() => {
      if (!authUser?._id) return;
      if (["admin", "delivery"].includes(authUser.role?.toLowerCase())) return;

      if (!socket.connected) {
         socket.connect();
         socket.on("connect", () => {
            socket.emit("joinUser", authUser._id);
         });
      } else {
         socket.emit("joinUser", authUser._id);
      }
      const handleOrderUpdate = (order) => {
         toast.dismiss();
         toast.success(`Your order is ${order.orderStatus}`);
      };
      socket.on("orderStatusUpdate", handleOrderUpdate);

      return () => {
         socket.off("orderStatusUpdate", handleOrderUpdate);
      };
   }, [authUser]);

   return (
      <div className="bg-yellow-50 min-h-screen">
         <Navbar setDrawerOpen={setDrawerOpen} />
         <AuthDrawer open={drawerOpen} setOpen={setDrawerOpen} />
         <Outlet />
         <Footer />
      </div>
   );
}

export default MainLayout;
