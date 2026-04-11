import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
   name: "admin",
   initialState: {
      shop: null,
      foods: [],
   },
   reducers: {
      setShop: (state, action) => {
         state.shop = action.payload;
      },
      setFood: (state, action) => {
         state.foods = action.payload;
      },
   },
});

export const { setShop, setFood } = adminSlice.actions;
export default adminSlice.reducer;
