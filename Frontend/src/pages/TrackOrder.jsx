import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import scooter from "../assets/motorcycle.png";
import home from "../assets/house.png";
import L from "leaflet";
import {
   MapContainer,
   TileLayer,
   Marker,
   Popup,
   Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../socket/socket";
import { IoArrowBack } from "react-icons/io5";

function TrackOrder() {
   const navigate = useNavigate();
   const markRef = useRef(null);
   const { id } = useParams();
   const [orderData, setOrderData] = useState(null);
   const [deliveryBoyLat, setDeliveryBoyLat] = useState(null);
   const [deliveryBoyLng, setDeliveryBoyLng] = useState(null);

   const customerIcon = new L.Icon({
      iconUrl: home,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
   });

   const scooterIcon = new L.Icon({
      iconUrl: scooter,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await axiosInstance.get(`/order/track/${id}`);
            const order = res.data.order;
            setOrderData(order);
            // delBoy lat lng
            const dbLat =
               order?.deliveryAssignment?.deliveryBoy?.location
                  ?.coordinates?.[1];
            const dbLng =
               order?.deliveryAssignment?.deliveryBoy?.location
                  ?.coordinates?.[0];
            if (dbLat && dbLng) {
               setDeliveryBoyLat(dbLat);
               setDeliveryBoyLng(dbLng);
            }
         } catch (error) {
            console.log(error);
         }
      };
      fetchData();
   }, [id]);

   // Socket
   useEffect(() => {
      const handleLocation = (data) => {
         if (data.orderId === id) {
            setDeliveryBoyLat(data.lat);
            setDeliveryBoyLng(data.lon);

            if (markRef.current) {
               markRef.current.setLatLng([data.lat, data.lon]);
            }
         }
      };

      const handleStatus = (updatedOrder) => {
         if (updatedOrder._id === id) {
            setOrderData((prev) => ({
               ...prev,
               orderStatus: updatedOrder.orderStatus,
            }));
         }
      };

      socket.on("deliveryBoyLocationUpdated", handleLocation);
      socket.on("orderStatusUpdate", handleStatus);

      return () => {
         socket.off("deliveryBoyLocationUpdated", handleLocation);
         socket.off("orderStatusUpdate", handleStatus);
      };
   }, [id]);

   if (!orderData)
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 gap-4">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-black text-sm">Loading</p>
         </div>
      );

   const customerLat = orderData.deliveryAdd?.latitude;
   const customerLng = orderData.deliveryAdd?.longitude;

   return (
      <div className="min-h-screen bg-yellow-50 flex justify-center p-4">
         <div className="w-full max-w-3xl space-y-4 border border-black/10 rounded-2xl p-3">
            {/* status*/}
            <div className="rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
               <div>
                  <button
                     onClick={() => navigate(-1)}
                     className="flex items-center text-black cursor-pointer"
                  >
                     {" "}
                     <IoArrowBack className="text-2xl" />{" "}
                  </button>
               </div>
               <h1 className="font-semibold text-gray-700">
                  STATUS:
                  <span className="ml-2 px-3 py-1 text-sm bg-orange-500 text-white rounded-full">
                     {orderData.orderStatus}
                  </span>
               </h1>
               <h1 className="text-gray-500 text-sm">
                  Order ID: #{orderData._id?.slice(-8)}
               </h1>
            </div>

            {/* Order detail */}
            <div className="rounded-xl shadow-md p-4">
               <div
                  className="flex flex-col md:flex-row gap-4 md:i
               tems-center md:justify-between"
               >
                  <div className="flex items-center gap-3">
                     <img
                        src={orderData.items?.[0]?.foodImg}
                        alt="food"
                        className="h-16 w-16 rounded-lg object-cover"
                     />
                     <div>
                        <p className="font-semibold text-gray-800">
                           {orderData.items?.[0]?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                           Qty: {orderData.items?.[0]?.quantity}
                        </p>
                        <p className="font-semibold text-gray-800">
                           ₹{orderData.totalAmount}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                     <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        className="h-10 w-10"
                        alt="delivery"
                     />
                     <div>
                        <p className="font-semibold text-gray-800">
                           {orderData.deliveryAssignment?.deliveryBoy?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                           {
                              orderData.deliveryAssignment?.deliveryBoy
                                 ?.mobileNumber
                           }
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Map */}
            <div className="bg-yellow-50 relative z-0 border border-black/10 rounded-xl shadow-md overflow-hidden">
               {customerLat && deliveryBoyLat ? (
                  <MapContainer
                     center={[customerLat, customerLng]}
                     zoom={14}
                     className="h-[400px] w-full"
                  >
                     <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     />

                     {/* Customer marker */}
                     <Marker
                        position={[customerLat, customerLng]}
                        icon={customerIcon}
                     >
                        <Popup> Your Location</Popup>
                     </Marker>

                     <Marker
                        ref={markRef}
                        position={[deliveryBoyLat, deliveryBoyLng]}
                        icon={scooterIcon}
                     >
                        <Popup>Delivery Boy</Popup>
                     </Marker>

                     <Polyline
                        key={`route-${deliveryBoyLat}-${deliveryBoyLng}`}
                        positions={[
                           [customerLat, customerLng],
                           [deliveryBoyLat, deliveryBoyLng],
                        ]}
                        color="blue"
                     />
                  </MapContainer>
               ) : (
                  <div className="h-[400px] flex items-center justify-center text-black">
                     Loading map...
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default TrackOrder;
