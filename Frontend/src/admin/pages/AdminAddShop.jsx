import React, { useState } from "react";
import axiosInstance from "../../services/api";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setShop } from "../../store/adminSlice";
import { useNavigate } from "react-router-dom";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import useLocationSearch from "../../hooks/useLocationSearch";

function AdminAddShop() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [previewImage, setPreviewImage] = useState(null);

   const [shopData, setShopData] = useState({
      shopName: "",
      shopImg: null,
      city: "",
      state: "",
      address: "",
      lat: "",
      lon: "",
   });

   const {
      searchText,
      setSearchText,
      loading: locationLoading,
      handleSearch,
      handleCurrentLocation,
   } = useLocationSearch(({ address, city, state, latitude, longitude }) => {
      setShopData((prev) => ({
         ...prev,
         address: address || prev.address,
         city: city || prev.city,
         state: state || prev.state,
         lat: latitude || prev.lat,
         lon: longitude || prev.lon,
      }));
   });

   const isLoading = loading || locationLoading;

   const handleShopImage = (file) => {
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
         toast.error("Image size too large. Max 5MB allowed");
         return;
      }
      setShopData((prev) => ({ ...prev, shopImg: file }));
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData();
      formData.append("shopName", shopData.shopName);
      formData.append("shopImg", shopData.shopImg);
      formData.append("city", shopData.city);
      formData.append("state", shopData.state);
      formData.append("address", shopData.address);
      formData.append("lat", shopData.lat);
      formData.append("lon", shopData.lon);

      try {
         const res = await axiosInstance.post("/shop/create-shop", formData);
         if (res.data.success) {
            dispatch(setShop(res.data.shop));
            navigate("/admin");
            toast.dismiss();
            toast.success(res.data.message);
         }
      } catch (error) {
         console.log(error);
         toast.dismiss();
         toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex justify-center bg-yellow-50 min-h-screen px-4 py-6">
         <div className="w-full max-w-2xl bg-white/10 border border-black/10 rounded-2xl p-5 sm:p-6 space-y-6 shadow-md">
            {/* Img upload */}
            <div className="flex flex-col items-center gap-4">
               <div className="w-full h-52 rounded-xl overflow-hidden border border-black/10  flex items-center justify-center text-zinc-500">
                  {previewImage ? (
                     <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                     />
                  ) : (
                     "Image Preview"
                  )}
               </div>

               <label className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition">
                  Upload Image
                  <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => handleShopImage(e.target.files[0])}
                     hidden
                  />
               </label>
            </div>

            {/* Location*/}
            <div className="flex gap-2">
               <input
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search your address..."
                  className="flex-1  border border-black/10 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
               />

               <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 rounded-lg cursor-pointer transition disabled:opacity-50"
               >
                  <CiSearch className="text-xl" />
               </button>

               <button
                  onClick={handleCurrentLocation}
                  disabled={isLoading}
                  className=" bg-orange-500 hover:bg-orange-600 text-white border border-black/10  px-3 rounded-lg cursor-pointer transition disabled:opacity-50"
               >
                  <FaLocationCrosshairs className="text-lg" />
               </button>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
               <input
                  type="text"
                  value={shopData.shopName}
                  onChange={(e) =>
                     setShopData((prev) => ({
                        ...prev,
                        shopName: e.target.value,
                     }))
                  }
                  placeholder="Shop Name"
                  className="w-full  border border-black/10 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
               />

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                     type="text"
                     value={shopData.city}
                     onChange={(e) =>
                        setShopData((prev) => ({
                           ...prev,
                           city: e.target.value,
                        }))
                     }
                     placeholder="City"
                     className=" border border-black/10 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  />

                  <input
                     type="text"
                     value={shopData.state}
                     onChange={(e) =>
                        setShopData((prev) => ({
                           ...prev,
                           state: e.target.value,
                        }))
                     }
                     placeholder="State"
                     className=" border border-black/10 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  />
               </div>

               <textarea
                  rows="3"
                  value={shopData.address}
                  onChange={(e) =>
                     setShopData((prev) => ({
                        ...prev,
                        address: e.target.value,
                     }))
                  }
                  placeholder="Full Address"
                  className="w-full  border border-black/10 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400 resize-none"
               />

               {/* Btn */}
               <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
               >
                  {isLoading ? "Please wait..." : "Create Shop"}
               </button>
            </form>
         </div>
      </div>
   );
}

export default AdminAddShop;
