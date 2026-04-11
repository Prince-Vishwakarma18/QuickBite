import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
   name: "user",
   initialState: {
      authUser: null,
      city: "",
      shopsInMyCity: [],
      cartItems: [],
      search: "",
      error: null,
   },
   reducers: {
      setAuthUser: (state, action) => {
         state.authUser = action.payload;
      },
      setUserCity: (state, action) => {
         state.city = action.payload;
      },
      setShopInMyCity: (state, action) => {
         state.shopsInMyCity = action.payload;
      },
      addToCart: (state, action) => {
         const newItem = action.payload;
         state.error = null;
         if (
            state.cartItems.length > 0 &&
            state.cartItems[0].shop._id !== newItem.shop._id
         ) {
            state.error = {
               message:
                  "Your cart contains items from another restaurant. Clear the cart to add this item.",
               id: Date.now(),
            };
            return;
         }
         const existingItem = state.cartItems.find(
            (i) => i._id === newItem._id,
         );
         if (existingItem) {
            existingItem.quantity += 1;
         } else {
            state.cartItems.push({ ...newItem, quantity: 1 });
         }
      },
      removeFromCart: (state, action) => {
         const item = state.cartItems.find((i) => i._id === action.payload);
         if (!item) return;
         if (item.quantity > 1) {
            item.quantity -= 1;
         } else {
            state.cartItems = state.cartItems.filter(
               (i) => i._id !== action.payload,
            );
         }
      },
      clearCart: (state) => {
         state.cartItems = [];
      },

      setSearch: (state, action) => {
         state.search = action.payload;
      },
   },
});

export const {
   setAuthUser,
   setUserCity,
   setShopInMyCity,
   addToCart,
   removeFromCart,
   clearCart,
   setSearch,
} = userSlice.actions;
export default userSlice.reducer;
