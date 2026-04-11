import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "./components/Layout/MainLayout";
import AdminLayout from "./admin/AdminLayout";
import MainDeliveryLayout from "./components/DeliveryBoy/MainDeliveryLayout";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckOutPage from "./pages/CheckOutPage";
import Order from "./pages/Order";
import TrackOrder from "./pages/TrackOrder";
import MenuPage from "./pages/MenuPage";
import ShopMenu from "./components/ShopMenu";
import CategoryFood from "./components/Food/CategoryFood";
import FoodDetail from "./components/Food/FoodDetail";
import AdminHome from "./admin/pages/AdminHome";
import AdminAddItem from "./admin/pages/AdminAddItem";
import AdminAddShop from "./admin/pages/AdminAddShop";
import AdminOrders from "./admin/pages/AdminOrders";
import DeliveryBoy from "./components/DeliveryBoy/DeliveryBoy";
import MyOrder from "./components/DeliveryBoy/pages/MyOrder";

import { useGetCity } from "./hooks/useGetCity";
import { useGetCityShop } from "./hooks/useGetCityShop";
import { useUpdateLocation } from "./hooks/useUpdateLocation";

function App() {
   const authUser = useSelector((state) => state.user.authUser);

   useGetCity();
   useGetCityShop();
   useUpdateLocation();

   return (
      <Routes>
         {/* User */}
         <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/food/:id" element={<FoodDetail />} />
            <Route path="/my-orders" element={<Order />} />
            <Route path="/order/:id" element={<TrackOrder />} />
            <Route path="/shop-foods/:id" element={<ShopMenu />} />
            <Route path="/category/:id" element={<CategoryFood />} />
            <Route
               path="/cart/checkout"
               element={authUser ? <CheckOutPage /> : <Navigate to="/cart" />}
            />
         </Route>


         {/* Del boy  */}
         <Route element={authUser?.role === "delivery" ? ( <MainDeliveryLayout /> ) : ( <Navigate to="/" /> )} >
            <Route path="/delivery-boy" element={<DeliveryBoy />} />
            <Route path="/delivery/my-orders" element={<MyOrder />} />
         </Route>

         {/* Admin */}
         <Route path="/admin" element={ authUser?.role === "admin" ? (<AdminLayout />) : ( <Navigate to="/" /> )} >
            <Route index element={<AdminHome />} />
            <Route path="add-product" element={<AdminAddItem />} />
            <Route path="create-shop" element={<AdminAddShop />} />
            <Route path="orders" element={<AdminOrders />} />
         </Route>
      </Routes>
   );
}

export default App;
