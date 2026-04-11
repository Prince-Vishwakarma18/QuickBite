import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminShop from "../components/AdminShop";
import AdminFoodCard from "../components/AdminFoodCard";

function AdminHome() {
   const navigate = useNavigate();
   const shop = useSelector((state) => state.admin.shop);

   if (!shop) {
      return (
         <div className="flex justify-center items-center min-h-screen p-6">
            <div className="bg-yellow-50 shadow-xl rounded-xl border border-black/10 p-8 text-center space-y-2 max-w-md w-full">
               <h2 className="text-xl font-bold text-black">
                  You don’t have a shop yet
               </h2>
               <p className="text-gray-500 text-sm">
                  Create your shop to start adding food items.
               </p>
               <button
                  onClick={() => navigate("/admin/create-shop")}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-md transition"
               >
                  Create Shop
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="md:p-6 space-y-4 bg-zinc-050">
         <AdminShop />
         <AdminFoodCard />
      </div>
   );
}

export default AdminHome;
