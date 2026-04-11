import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function useLocationSearch(onLocationFound) {
   const [searchText, setSearchText] = useState("");
   const [loading, setLoading] = useState(false);

   // search location
   const handleSearch = async () => {
      if (!searchText.trim()) {
         toast.dismiss();
         toast.error("Enter address");
         return;
      }
      try {
         setLoading(true);
         const res = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
               params: {
                  text: searchText,
                  limit: 1,
                  apiKey: import.meta.env.VITE_GEO_API_KEY,
               },
            },
         );
         const feature = res.data?.features?.[0];
         if (!feature) {
            toast.dismiss();
            toast.error("Location not found");
         }
         const { formatted, city, state, lat, lon } = feature.properties;
         setSearchText(formatted);
         onLocationFound({
            address: formatted,
            city,
            state,
            latitude: lat,
            longitude: lon,
         });
      } catch {
         toast.dismiss();
         toast.error("Failed to fetch location");
      } finally {
         setLoading(false);
      }
   };

   // current location
   const handleCurrentLocation = () => {
      if (!navigator.geolocation) {
         toast.dismiss();
         toast.error("Geolocation not supported");
      }
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
         async ({ coords }) => {
            try {
               const { data } = await axios.get(
                  "https://api.geoapify.com/v1/geocode/reverse",
                  {
                     params: {
                        lat: coords.latitude,
                        lon: coords.longitude,
                        format: "json",
                        apiKey: import.meta.env.VITE_GEO_API_KEY,
                     },
                  },
               );
               const result = data?.results?.[0];
               const formatted = result?.formatted || "";
               const city = result?.city || result?.county || "";
               const state = result?.state || "";

               setSearchText(formatted);
               onLocationFound({
                  address: formatted,
                  city,
                  state,
                  latitude: coords.latitude,
                  longitude: coords.longitude,
               });
            } catch {
               toast.dismiss();
               toast.error("Unable to get address");
            } finally {
               setLoading(false);
            }
         },
         () => {
            toast.dismiss();
            toast.error("Location permission denied");
            setLoading(false);
         },
      );
   };

   return {
      searchText,
      setSearchText,
      loading,
      handleSearch,
      handleCurrentLocation,
   };
}

export default useLocationSearch;
