import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import axiosInstance from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import Earning from "../components/Earning";
function AdminOrders() {
   const navigate = useNavigate();
   const [orders, setAdminOrders] = useState([]);

   useEffect(() => {
      const fetchAdminOrders = async () => {
         try {
            const res = await axiosInstance.get("/order/admin-orders");
            setAdminOrders(res.data.orders);
         } catch (error) {
            console.log(error);
            toast.error("Failed to fetch orders");
         }
      };

      fetchAdminOrders();
   }, []);

   const handleStatusChange = async (orderId, status) => {
      try {
         await axiosInstance.patch(`/order/update/${orderId}`, { status });
         setAdminOrders((prevOrders) =>
            prevOrders.map((order) =>
               order._id === orderId
                  ? { ...order, orderStatus: status }
                  : order,
            ),
         );
         toast.dismiss();
         toast.success("Status updated");
      } catch (error) {
         console.log(error);
         toast.dismiss();
         toast.error("Update failed");
      }
   };

   return (
      <div className="bg-yellow-50 min-h-screen p-4 sm:p-6 w-full overflow-y-scroll">
         <div className="relative flex items-center mb-1">
            <button
               onClick={() => navigate(-1)}
               className="absolute left-0 cursor-pointer text-black"
            >
               <IoArrowBack className="text-2xl" />
            </button>

            <h1 className="w-full text-center uppercase text-black text-xl font-bold tracking-wide">
               Customer <span className="text-orange-500">Orders</span>
            </h1>
         </div>
         <Earning />
         {/* Orders */}
         <div className="space-y-4">
            {orders.map((order) => (
               <div
                  key={order._id}
                  className="rounded-xl bg-white/10 border border-black/10 shadow font-semibold p-4 flex flex-col lg:flex-row gap-4 hover:border-black/20 transition"
               >
                  {/* LEFT */}
                  <div className="flex-1 lg:border-r border-zinc-800 pr-0 lg:pr-4">
                     <p className="text-xs text-zinc-500">
                        {new Date(order.createdAt).toLocaleString()}
                     </p>

                     <p className="text-sm text-gray-800 mt-1">
                        {order.user?.email}
                     </p>

                     <ul className="mt-3 text-sm text-zinc-400 space-y-1">
                        {order.items.map((item, i) => (
                           <li key={i}>
                              🍽 {item.name} × {item.quantity}
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* MIDDLE */}
                  <div className="flex-1 lg:border-r border-zinc-800 pr-0 lg:pr-4 text-sm text-zinc-400">
                     <p className="flex items-center gap-1 font-medium mb-1 text-gray-800">
                        <FaLocationDot className="text-red-500" /> Delivery
                        Location
                     </p>

                     <p className="text-xs leading-relaxed">
                        {order.deliveryAdd?.text}
                     </p>

                     <p className="mt-2 text-xs text-zinc-500">
                        {order.deliveryAdd?.latitude},{" "}
                        {order.deliveryAdd?.longitude}
                     </p>

                     <div className="mt-4">
                        <p className="text-sm font-medium text-gray-800">
                           Delivery Boy
                        </p>

                        {order.deliveryAssignment?.deliveryBoy ? (
                           <>
                              <p className="text-sm">
                                 {order.deliveryAssignment.deliveryBoy.fullName}
                              </p>
                              <p className="text-xs text-zinc-500">
                                 {
                                    order.deliveryAssignment.deliveryBoy
                                       .mobileNumber
                                 }
                              </p>
                           </>
                        ) : (
                           <p className="text-xs text-red-400">
                              Not assigned yet
                           </p>
                        )}
                     </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-row lg:flex-col justify-between gap-3">
                     <div>
                        <p className="text-xs text-zinc-500">Total</p>
                        <p className="text-xl font-bold text-green-400">
                           ₹{order.totalAmount}
                        </p>

                        <p className="text-xs text-zinc-500 mt-1">
                           {order.paymentMethod} • {order.paymentStatus}
                        </p>
                     </div>

                     <select
                        value={order.orderStatus}
                        disabled={order.orderStatus === "CANCELLED"}
                        onChange={(e) =>
                           handleStatusChange(order._id, e.target.value)
                        }
                        className="border border-black/10 text-black  rounded py-2 focus:outline-none focus:border-zinc-500"
                     >
                        <option value="PLACED">Placed</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY_FOR_DELIVERY">
                           Ready for delivery
                        </option>
                        <option value="OUT_FOR_DELIVERY">
                           Out for delivery
                        </option>
                        <option value="DELIVERED">Delivered</option>
                        <option className="" value="CANCELLED">
                           CANCELLED
                        </option>
                     </select>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default AdminOrders;
