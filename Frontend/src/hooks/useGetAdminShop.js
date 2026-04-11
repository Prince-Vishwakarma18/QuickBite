import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../services/api";
import { setShop } from "../store/adminSlice";

const useGetAdminShop = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      const fetchShop = async () => {
         try {
            const res = await axiosInstance.get("/shop/admin-shops");

            if (res.data.success) {
               dispatch(setShop(res.data.shop));
               console.log(res.data);
            }
         } catch (error) {
            console.log(error.response?.data?.message);
         }
      };

      fetchShop();
   }, [dispatch]);
};

export default useGetAdminShop;
