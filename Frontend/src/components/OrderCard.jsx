import RatingStar from "./RatingStar";
import { useNavigate } from "react-router-dom";

function OrderCard({ order, handleCancelOrder }) {
   const navigate = useNavigate();

   return (
      <div className="w-full rounded-2xl shadow-xl font-bold bg-white/10 border border-black/10 px-4 space-y-3">
         <div className="flex justify-between items-center pt-3">
            <div>
               <h1 className="font-semibold text-lg text-black">
                  Order #{order._id.slice(-8)}
               </h1>
               <p className="text-sm text-zinc-400">
                  Payment: {order.paymentMethod}
               </p>
            </div>
            <span
               className={`px-3 py-1 text-xs rounded-full text-white font-medium ${
                  order.paymentStatus === "PAID"
                     ? "bg-green-500"
                     : "bg-orange-500"
               }`}
            >
               {order.paymentStatus}
            </span>
         </div>

         {/* Items */}
         {order.items?.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
               <img
                  className="h-20 w-20 rounded-xl object-cover"
                  src={item.foodImg}
                  alt={item.name}
               />
               <div className="flex-1">
                  <h1 className="font-medium text-black">{item.name}</h1>
                  <p className="text-sm text-zinc-400">
                     Qty: {item.quantity} x ₹{item.price}
                  </p>
                  {order.orderStatus === "DELIVERED" && (
                     <RatingStar item={item} />
                  )}
               </div>
               <p className="font-semibold text-black">
                  ₹{item.price * item.quantity}
               </p>
            </div>
         ))}

         <hr className="border-zinc-800" />

         {/* Footer */}
         <div className="flex justify-between items-center pb-3 flex-wrap gap-2">
            <div>
               <p className="text-sm text-zinc-400">Status</p>
               <p
                  className={`font-semibold ${
                     order.orderStatus === "DELIVERED"
                        ? "text-green-400"
                        : "text-orange-500"
                  }`}
               >
                  {order.orderStatus}
               </p>
            </div>
            <div className="text-right">
               <p className="text-sm text-zinc-400">Total</p>
               <p className="font-bold text-lg text-black">
                  ₹{order.totalAmount}
               </p>
            </div>
            <div className="w-full flex gap-2">
               {order.orderStatus === "OUT_FOR_DELIVERY" && (
                  <button
                     onClick={() => navigate(`/order/${order._id}`)}
                     className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                     Track Order
                  </button>
               )}
               {(order.orderStatus === "PLACED" ||
                  order.orderStatus === "PREPARING") && (
                  <button
                     onClick={() => handleCancelOrder(order._id)}
                     className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                     Cancel Order
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}

export default OrderCard;
