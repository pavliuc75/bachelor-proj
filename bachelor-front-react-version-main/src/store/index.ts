import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice";
import administratorManagementToolReducer from "./administratorManagementToolSlice";
import businessManagementToolReducer from "./businessManagementToolSlice";
import businessReducer from "./businessSlice";
import cartReducer from "./cartSlice";
import favoritesReducer from "./favoritesSlice";
import ordersReducer from "./ordersSlice";
import productReducer from "./productSlice";
import searchReducer from "./searchSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    administratorManagementTool: administratorManagementToolReducer,
    businessManagementTool: businessManagementToolReducer,
    business: businessReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
    product: productReducer,
    search: searchReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
