import { useEffect } from "react";
import axiosInstance from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setFoodByCity } from "../store/foodSlice";

export const useGetFoodByCity = () => {
   const dispatch = useDispatch();
   const city = useSelector((state) => state.user.city);
   const authUser = useSelector((state) => state.user.authUser);

   useEffect(() => {
      const fetchFoods = async () => {
         try {
            let url = "/food";
            if (authUser && city && city.trim() !== "") {
               url = `/food?city=${city}`;
            }
            const res = await axiosInstance.get(url);

            if (res.data.success) {
               dispatch(setFoodByCity(res.data.foods));
            }
         } catch (error) {
            console.log("Error in fetching foods:", error);
         }
      };

      fetchFoods();
   }, [city, dispatch, authUser]);
};
