import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ lat, lon }) {
   return (
      <MapContainer
         center={[lat, lon]}
         zoom={13}
         scrollWheelZoom={false}
         style={{ height: "100%", width: "100%" }}
      >
         <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />

         <Marker position={[lat, lon]}>
            <Popup>Delivery Location</Popup>
         </Marker>
      </MapContainer>
   );
}

export default Map;
