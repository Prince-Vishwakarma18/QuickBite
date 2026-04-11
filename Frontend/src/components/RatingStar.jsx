import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import axiosInstance from "../services/api";
import toast from "react-hot-toast";

function RatingStar({ item }) {
   const user = useSelector((state) => state.user.authUser);
   const [rating, setRating] = useState(0);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const userRatings = item.product?.ratings?.find(
         (r) => r.user?.toString() === user?._id?.toString(),
      );

      if (userRatings) {
         setRating(userRatings.rating);
      }
   }, [item, user]);

   const handleClick = async (star) => {
      try {
         setRating(star);
         setLoading(true);

         const res = await axiosInstance.post(
            `/food/rate/${item?.product?._id}`,
            { rating: star },
         );

         if (res.data.success) {
            toast.dismiss();
            toast.success(res.data.message);
         }
      } catch (error) {
         toast.dismiss();
         toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex gap-1">
         {[1, 2, 3, 4, 5].map((star) => (
            <button
               key={star}
               onClick={() => handleClick(star)}
               disabled={loading}
               className={`text-yellow-400 ${
                  loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
               }`}
            >
               {star <= rating ? <FaStar size={16} /> : <FaRegStar size={16} />}
            </button>
         ))}
      </div>
   );
}

export default RatingStar;
