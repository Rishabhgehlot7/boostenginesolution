import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import orderReducer from "./features/orderSlice";
import productReducer from './features/productSlice';
import reviewReducer from "./features/reviewSlice";
import userReducer from "./features/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      cart: cartReducer,
      product: productReducer,
      review: reviewReducer ,
      order: orderReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default makeStore;