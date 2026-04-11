import axios from "axios";
import axiosInstance from "../services/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserCity } from "../store/userSlice";
import { setMapLocation } from "../store/mapSlice";

export const useGetCity = () => {
   const dispatch = useDispatch();
   const authUser = useSelector((state) => state.user.authUser);

   useEffect(() => {
      if (!authUser) return;

      navigator.geolocation.getCurrentPosition(async (position) => {
         try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const res = await axios.get(
               `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEO_API_KEY}`,
            );

            const address = res.data.results[0]?.formatted;
            const city = res.data.results[0]?.city;

            dispatch(setMapLocation({ latitude, longitude, address }));
            dispatch(setUserCity(city));

            if (authUser.role === "delivery") {
               await axiosInstance.post("/auth/update-location", {
                  lat: latitude,
                  lon: longitude,
               });
            }
         } catch (error) {
            console.log(error);
         }
      });
   }, [authUser, dispatch]);
};
