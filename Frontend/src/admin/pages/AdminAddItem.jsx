import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function AdminAddItem() {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [previewImg, setPreviewImg] = useState("");

   const [foodData, setFoodData] = useState({
      foodName: "",
      foodImg: null,
      price: "",
      category: "",
      foodType: "",
   });

   // Handle Img upload
   const handleImage = (file) => {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
         toast.error("Image size too large. Max 5MB allowed");
         return;
      }
      setFoodData((prev) => ({
         ...prev,
         foodImg: file,
      }));

      const imageURL = URL.createObjectURL(file);
      setPreviewImg(imageURL);
   };

   useEffect(() => {
      return () => {
         if (previewImg) URL.revokeObjectURL(previewImg);
      };
   }, [previewImg]);

   // Handle Submit
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (
         !foodData.foodName ||
         !foodData.foodImg ||
         !foodData.price ||
         !foodData.category ||
         !foodData.foodType
      ) {
         toast.dismiss();
         return toast.error("All fields are required");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("foodName", foodData.foodName);
      formData.append("foodImg", foodData.foodImg);
      formData.append("price", foodData.price);
      formData.append("category", foodData.category);
      formData.append("foodType", foodData.foodType);

      try {
         const res = await axiosInstance.post("/food/add", formData);

         if (res.data.success) {
            toast.dismiss();
            toast.success(res.data.message);
            setFoodData({
               foodName: "",
               foodImg: null,
               price: "",
               category: "",
               foodType: "",
            });
            setPreviewImg("");

            navigate("/admin");
         }
      } catch (error) {
         console.log("error", error);
         toast.dismiss();
         toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full flex justify-center bg-yellow-50 min-h-screen px-4 py-6">
         <div className="w-full max-w-2xl bg-white/10 border border-black/10 rounded-2xl p-5 sm:p-6 space-y-6 shadow-md">
            <div className="flex items-center">
               <button
                  onClick={() => navigate(-1)}
                  className=" text-black cursor-pointer"
               >
                  <IoArrowBack className="text-2xl" />
               </button>

               <h1 className="w-full text-center text-lg sm:text-xl font-semibold text-black">
                  Add New Food Item
               </h1>
            </div>

            {/* Img upload */}
            <div className="flex flex-col items-center gap-4">
               <div className="w-44 h-44 rounded-full border border-black/10 shadow overflow-hidden flex items-center justify-center text-zinc-500 text-sm">
                  {previewImg ? (
                     <img
                        src={previewImg}
                        alt="Preview"
                        className="w-full h-full object-cover"
                     />
                  ) : (
                     "Preview"
                  )}
               </div>

               <label className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition">
                  Upload Image
                  <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => handleImage(e.target.files[0])}
                     hidden
                  />
               </label>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                     type="text"
                     value={foodData.foodName}
                     onChange={(e) =>
                        setFoodData((prev) => ({
                           ...prev,
                           foodName: e.target.value,
                        }))
                     }
                     placeholder="Food Name"
                     className=" border border-zinc-700 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  />

                  <input
                     type="number"
                     value={foodData.price}
                     onChange={(e) =>
                        setFoodData((prev) => ({
                           ...prev,
                           price: e.target.value,
                        }))
                     }
                     placeholder="Price"
                     className=" border border-zinc-700 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                     value={foodData.category}
                     onChange={(e) =>
                        setFoodData((prev) => ({
                           ...prev,
                           category: e.target.value,
                        }))
                     }
                     className=" border border-zinc-700 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  >
                     <option value="">Select Category</option>
                     <option value="Dessert">Dessert</option>
                     <option value="Chicken">Chicken</option>
                     <option value="Mutton">Mutton</option>
                     <option value="Chinese">Chinese</option>
                     <option value="Italian">Italian</option>
                     <option value="Pizza">Pizza</option>
                     <option value="Burger">Burger</option>
                     <option value="Fast Food">Fast Food</option>
                     <option value="South Indian">South Indian</option>
                     <option value="North Indian">North Indian</option>
                     <option value="Snacks">Snacks</option>
                     <option value="Bakery">Bakery</option>
                  </select>

                  <select
                     value={foodData.foodType}
                     onChange={(e) =>
                        setFoodData((prev) => ({
                           ...prev,
                           foodType: e.target.value,
                        }))
                     }
                     className=" border border-zinc-700 text-gray-800 rounded-lg px-3 py-2 outline-none focus:border-orange-400"
                  >
                     <option value="">Select Type</option>
                     <option value="Veg">Veg</option>
                     <option value="Non-Veg">Non-Veg</option>
                  </select>
               </div>

               {/* Btn */}
               <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
               >
                  {loading ? "Adding..." : "Add Food"}
               </button>
            </form>
         </div>
      </div>
   );
}

export default AdminAddItem;
