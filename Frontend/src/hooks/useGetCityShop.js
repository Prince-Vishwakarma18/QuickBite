import { useEffect } from "react";
import axiosInstance from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setShopInMyCity } from "../store/userSlice";

export const useGetCityShop = () => {
   const dispatch = useDispatch();

   const { latitude, longitude } = useSelector((state) => state.map.location);

   useEffect(() => {
      if (!latitude || !longitude) return;

      const fetchShops = async () => {
         try {
            const res = await axiosInstance.get(
               `/shop?lat=${latitude}&lon=${longitude}`,
            );

            if (res.data.success) {
               dispatch(setShopInMyCity(res.data.shops));
            }
         } catch (error) {
            console.log("Error in fetching shops:", error);
         }
      };

      fetchShops();
   }, [latitude, longitude, dispatch]);
};
