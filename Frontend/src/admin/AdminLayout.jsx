import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import useGetAdminShop from "../hooks/useGetAdminShop";
import { useEffect } from "react";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function AdminLayout() {
   useGetAdminShop();
   const authUser = useSelector((state) => state.user.authUser);

   useEffect(() => {
      if (!authUser || authUser.role !== "admin") return;
      if (!socket.connected) {
         socket.connect();
      }
      if (authUser.shop) {
         socket.emit("joinShop", authUser.shop);
      }
      const handleNewOrder = (newOrder) => {
         //  console.log("newOrder", newOrder);
         toast.success("New Order received");
      };
      socket.on("newOrder", handleNewOrder);

      return () => {
         socket.off("newOrder", handleNewOrder);
      };
   }, [authUser]);

   return (
      <div className="bg-yellow-50">
         <AdminNavbar />
         <Outlet />
      </div>
   );
}

export default AdminLayout;
