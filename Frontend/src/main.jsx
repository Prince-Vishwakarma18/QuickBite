import ScrollToTop from "./components/ScrollTop.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
   <Provider store={store}>
      <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
         <BrowserRouter>
            <ScrollToTop />
            <App />
            <Toaster />
         </BrowserRouter>
      </PersistGate>
   </Provider>,
);
