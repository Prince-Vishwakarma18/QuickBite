import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../services/api";
import { socket } from "../socket/socket";
import { setLiveLocation } from "../store/mapSlice";

export const useUpdateLocation = () => {
   const dispatch = useDispatch();
   const activeOrder = useSelector((state) => state.map.activeOrder);
   const authUser = useSelector((state) => state.user.authUser);

   useEffect(() => {
      if (!authUser) return;
      if (authUser.role !== "delivery") return;
      if (!activeOrder?._id) return;

      let lastUpdateTime = 0;

      const updateLocation = async (lat, lon) => {
         const now = Date.now();
         if (now - lastUpdateTime < 7000) return;
         lastUpdateTime = now;

         try {
            dispatch(setLiveLocation({ latitude: lat, longitude: lon }));
            await axiosInstance.post("/auth/update-location", { lat, lon });

            // Socket
            socket.emit("deliveryBoyLocationUpdate", {
               orderId: activeOrder._id,
               userId: activeOrder.user?._id || activeOrder.user,
               lat,
               lon,
            });
         } catch (error) {
            console.error("Location update failed", error);
         }
      };

      const watchId = navigator.geolocation.watchPosition(
         (position) => {
            updateLocation(position.coords.latitude, position.coords.longitude);
         },
         (error) => {
            console.error("Geolocation error:", error);
         },
         {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000,
         },
      );

      return () => navigator.geolocation.clearWatch(watchId);
   }, [authUser, activeOrder, dispatch]);
};
