import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../services/api";
import { setShop } from "../../store/adminSlice";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

function AdminShop() {
   const dispatch = useDispatch();
   const shop = useSelector((state) => state.admin.shop);
   const [isEditing, setIsEditing] = useState(false);
   const [preview, setPreview] = useState();
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      shopImg: null,
      shopName: shop?.shopName || "",
      city: shop?.city || "",
      state: shop?.state || "",
   });

   const handleImage = (file) => {
      if (!file) return;
      setFormData((prev) => ({
         ...prev,
         shopImg: file,
      }));
      const imgUrl = URL.createObjectURL(file);
      setPreview(imgUrl);
   };

   const handleUpdate = async () => {
      setLoading(true);
      try {
         const form = new FormData();
         form.append("shopName", formData.shopName);
         form.append("city", formData.city);
         form.append("state", formData.state);

         if (formData.shopImg) {
            form.append("shopImg", formData.shopImg);
         }
         const res = await axiosInstance.patch("/shop/update", form, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         if (res.data.success) {
            dispatch(setShop(res.data.shop));
            toast.dismiss();
            toast.success("Shop Updated");
            setIsEditing(false);
            setPreview(null);
         }
      } catch (error) {
         toast.dismiss();
         toast.error("Update Failed");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full flex justify-center bg-yellow-50 px-4 py-2 sm:py-0">
         <div className="w-full  border border-black/10 rounded-2xl p-5 sm:p-6 space-y-3 shadow-md">
            {isEditing ? (
               <div className="space-y-6">
                  {/* Img upload */}
                  <div className="flex flex-col items-center gap-3">
                     <img
                        src={preview || shop?.shopImg}
                        alt=""
                        className="h-52 md:h-72 min-w-full  border-2 border-zinc-700 object-cover"
                     />

                     <label className="cursor-pointer px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                        Upload Image
                        <input
                           type="file"
                           hidden
                           onChange={(e) => handleImage(e.target.files[0])}
                        />
                     </label>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="flex flex-col gap-1">
                        <label className="text-xs text-black">Shop Name</label>
                        <input
                           type="text"
                           value={formData.shopName}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 shopName: e.target.value,
                              })
                           }
                           className="px-3 py-2 rounded-lg  border border-zinc-700 text-gray-800 focus:outline-none focus:border-orange-400"
                        />
                     </div>

                     <div className="flex flex-col gap-1">
                        <label className="text-xs text-black">City</label>
                        <input
                           type="text"
                           value={formData.city}
                           onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                           }
                           className="px-3 py-2 rounded-lg  border border-zinc-700 text-gray-800 focus:outline-none focus:border-orange-400"
                        />
                     </div>

                     <div className="flex flex-col gap-1">
                        <label className="text-xs text-black">State</label>
                        <input
                           type="text"
                           value={formData.state}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 state: e.target.value,
                              })
                           }
                           className="px-3 py-2 rounded-lg  border border-zinc-700 text-gray-800 focus:outline-none focus:border-orange-400"
                        />
                     </div>
                  </div>

                  {/* Btn */}
                  <div className="flex gap-3 pt-2">
                     <button
                        disabled={loading}
                        onClick={handleUpdate}
                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition"
                     >
                        {loading ? "Updating..." : "Save Changes"}
                     </button>

                     <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-zinc-800 text-white py-2 rounded-lg font-medium hover:bg-zinc-700 transition"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
            ) : (
               <div className="space-y-5">
                  {/* Img */}
                  <div className="relative border border-white/30 rounded-xl">
                     <img
                        src={shop.shopImg}
                        alt=""
                        className="h-52 sm:h-72 w-full object-cover rounded-xl"
                     />

                     <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-3 right-3 text-orange-400  p-2 rounded-full bg-zinc-800 transition"
                     >
                        <FaEdit />
                     </button>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <div className="border border-black/10 rounded-xl px-4 py-3">
                        <p className="text-black text-[11px] uppercase tracking-wide mb-1">
                           Shop
                        </p>
                        <p className="text-black text-sm font-medium truncate">
                           {shop?.shopName}
                        </p>
                     </div>

                     <div className="border border-black/10 rounded-xl px-4 py-3">
                        <p className="text-black text-[11px] uppercase tracking-wide mb-1">
                           City
                        </p>
                        <p className="text-black text-sm font-medium truncate">
                           {shop?.city}
                        </p>
                     </div>

                     <div className="border border-black/10 rounded-xl px-4 py-3">
                        <p className="text-black text-[11px] uppercase tracking-wide mb-1">
                           State
                        </p>
                        <p className="text-black text-sm font-medium truncate">
                           {shop?.state}
                        </p>
                     </div>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-col sm:flex-row gap-3 border-t border-black/10 pt-4">
                     <div className="flex-1 border border-black/10 rounded-xl px-4 py-3">
                        <p className="text-black text-[11px] uppercase tracking-wide mb-1">
                           Created
                        </p>
                        <p className="text-black text-sm font-medium">
                           {new Date(shop.createdAt).toLocaleDateString()}
                        </p>
                     </div>

                     <div className="flex-1 border border-black/10 rounded-xl px-4 py-3">
                        <p className="text-black text-[11px] uppercase tracking-wide mb-1">
                           Last Updated
                        </p>
                        <p className="text-black text-sm font-medium">
                           {new Date(shop.updatedAt).toLocaleDateString()}
                        </p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export default AdminShop;
