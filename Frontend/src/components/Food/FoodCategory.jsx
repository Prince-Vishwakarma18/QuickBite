import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
   {
      id: "Dessert",
      label: "Dessert",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100",
   },
   {
      id: "Chinese",
      label: "Chinese",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=100",
   },
   {
      id: "Chicken",
      label: "Chicken",
      image: "https://plus.unsplash.com/premium_photo-1669742927923-32d9ee86887c?q=80&w=387",
   },
   {
      id: "Mutton",
      label: "Mutton",
      image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=100",
   },
   {
      id: "Italian",
      label: "Italian",
      image: "https://plus.unsplash.com/premium_photo-1678897742200-85f052d33a71?q=80&w=870",
   },
   {
      id: "Pizza",
      label: "Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=870",
   },
   {
      id: "Burger",
      label: "Burger",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=100",
   },
   {
      id: "Fast Food",
      label: "Fast Food",
      image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=100",
   },
   {
      id: "South Indian",
      label: "South Indian",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=100",
   },
   {
      id: "North Indian",
      label: "North Indian",
      image: "https://images.unsplash.com/photo-1727404679933-99daa2a7573a?q=80&w=387",
   },
   {
      id: "Snacks",
      label: "Snacks",
      image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=100",
   },
   {
      id: "Bakery",
      label: "Bakery",
      image: "https://plus.unsplash.com/premium_photo-1681826507324-0b3c43928753?q=80&w=869",
   },
];
function FoodCategory() {
   const navigate = useNavigate();

   const handleClick = (id) => {
      navigate(`/category/${id}`);
   };

   return (
      <div className="py-4">
         <h2 className="text-lg font-semibold text-black">
            What are you craving?
         </h2>

         <div className="flex overflow-x-auto gap-3 sm:gap-4 md:px-4 py-4 scrollbar-hide">
            {categories.map((cat) => (
               <div
                  key={cat.id}
                  onClick={() => handleClick(cat.id)}
                  className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-700"
               >
                  <div className="w-20 h-20 rounded-full shadow-md shadow-black overflow-hidden border-orange-500 border-2">
                     <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover"
                     />
                  </div>

                  <span className="text-sm font-semibold text-center text-black truncate w-full">
                     {cat.label}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
}

export default FoodCategory;
