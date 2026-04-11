import { useSelector } from "react-redux";
import FoodBanner from "../components/Food/FoodBanner";
import FoodCategory from "../components/Food/FoodCategory";
import FoodMenu from "../components/Food/FoodMenu";
import ShopCard from "../components/ShopCard";
import { useGetCity } from "../hooks/useGetCity";
import { useGetCityShop } from "../hooks/useGetCityShop";
import { useGetFoodByCity } from "../hooks/useGetFoodByCity";

function Home() {
   useGetCity();
   useGetCityShop();
   useGetFoodByCity();
   const search = useSelector((state) => state.user.search);
   const shop = useSelector((state) => state.user.shopsInMyCity);

   return (
      <div className="px-1.5 md:py-3 bg-yellow-50">
         <div className="bg-yellow-50">
            {search ? (
               <FoodMenu />
            ) : (
               <>
                  <FoodBanner />
                  <FoodCategory />
                  <ShopCard />
                  {shop && shop.length > 0 && (
                     <div>
                        <h1 className="text-sm sm:text-xl uppercase text-black text-center font-bold pb-4">
                           Browse Our{" "}
                           <span className="text-orange-500">Menu</span>
                        </h1>
                        <FoodMenu />
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
}

export default Home;
