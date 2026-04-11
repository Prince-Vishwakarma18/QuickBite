import React from "react";
import {
   MapContainer,
   TileLayer,
   Marker,
   Popup,
   Polyline,
} from "react-leaflet";
import scooter from "../../assets/motorcycle.png";
import home from "../../assets/house.png";
import L from "leaflet";
import { useSelector } from "react-redux";

function DeliveryBoyTrack() {
   const activeOrder = useSelector((state) => state.map.activeOrder);
   const liveLocation = useSelector((state) => state.map.liveLocation);

   const customerLat = activeOrder?.deliveryAdd?.latitude;
   const customerLng = activeOrder?.deliveryAdd?.longitude;

   const deliveryBoyLat =
      liveLocation?.latitude ??
      activeOrder?.deliveryAssignment?.deliveryBoy?.location?.coordinates?.[1];
   const deliveryBoyLng =
      liveLocation?.longitude ??
      activeOrder?.deliveryAssignment?.deliveryBoy?.location?.coordinates?.[0];

   const scooterIcon = new L.Icon({
      iconUrl: scooter,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
   });

   const homeIcon = new L.Icon({
      iconUrl: home,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
   });

   return (
      <div className="w-full">
         <div className="h-[400px] w-full rounded-xl overflow-hidden shadow">
            {customerLat && deliveryBoyLat ? (
               <MapContainer
                  center={[customerLat, customerLng]}
                  zoom={14}
                  className="h-full w-full"
               >
                  <TileLayer
                     attribution="&copy; OpenStreetMap contributors"
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Customer */}
                  <Marker position={[customerLat, customerLng]} icon={homeIcon}>
                     <Popup>Delivery loaction</Popup>
                  </Marker>

                  {/* Delivery Boy */}
                  <Marker
                     key={`${deliveryBoyLat}-${deliveryBoyLng}`}
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
   );
}

export default DeliveryBoyTrack;
