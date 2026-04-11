import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
   name: "map",
   initialState: {
      location: {
         latitude: null,
         longitude: null,
         address: "",
      },
      liveLocation: {
         latitude: null,
         longitude: null,
      },
      activeOrder: null,
   },
   reducers: {
      setMapLocation: (state, action) => {
         state.location = action.payload;
      },
      setLiveLocation: (state, action) => {
         state.liveLocation = action.payload;
      },
      setActiveOrder: (state, action) => {
         state.activeOrder = action.payload;
      },
   },
});

export const { setMapLocation, setActiveOrder, setLiveLocation } =
   mapSlice.actions;
export default mapSlice.reducer;
