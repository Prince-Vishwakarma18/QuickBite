import { useEffect } from "react";
import axiosInstance from "../services/api";
import { setFood } from "../store/adminSlice";
import { useDispatch } from "react-redux";

export const useGetAdminFoodList = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      const fetchFood = async () => {
         try {
            const res = await axiosInstance.get("/food/admin/food-list");
            if (res.data.success) {
               dispatch(setFood(res.data.foods));
            }
         } catch (error) {
            console.log("Error fetchFood", error);
         }
      };
      fetchFood();
   }, [dispatch]);
};
