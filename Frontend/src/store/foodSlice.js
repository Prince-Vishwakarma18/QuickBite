import { createSlice } from "@reduxjs/toolkit";

const foodSlice = createSlice({
   name: "food",
   initialState: {
      foodByCity: [],
   },
   reducers: {
      setFoodByCity: (state, action) => {
         state.foodByCity = action.payload;
      },
   },
});

export const { setFoodByCity } = foodSlice.actions;
export default foodSlice.reducer;
