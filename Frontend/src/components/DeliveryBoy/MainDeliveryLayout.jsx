import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function MainDeliveryLayout() {
   return (
      <div className="bg-yellow-50">
         <Navbar />
         <Outlet />
      </div>
   );
}

export default MainDeliveryLayout;
