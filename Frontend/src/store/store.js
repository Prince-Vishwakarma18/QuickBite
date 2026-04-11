import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
   persistStore,
   persistReducer,
   FLUSH,
   REHYDRATE,
   PAUSE,
   PERSIST,
   PURGE,
   REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import foodReducer from "./foodSlice";
import mapReducer from "./mapSlice";

const rootReducer = combineReducers({
   user: userReducer,
   admin: adminReducer,
   food: foodReducer,
   map: mapReducer,
});

const persistConfig = {
   key: "root",
   version: 1,
   storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
         },
      }),
});

export const persistor = persistStore(store);
