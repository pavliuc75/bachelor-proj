import { Order, OrderStatus } from "../generated-sources/openapi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import { api } from "../service/apiClient";
import i18n from "i18next";

export interface State {
  orders: Order[] | undefined;
  ordersTotalPages: number;
  ordersCurrentPage: number;
  ordersCurrentFilter: "ALL" | OrderStatus | undefined;
}

const initialState: State = {
  orders: [],
  ordersTotalPages: 1,
  ordersCurrentPage: 1,
  ordersCurrentFilter: "ALL",
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[] | undefined>) => {
      state.orders = action.payload;
    },
    setOrdersTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.ordersTotalPages = action.payload || 1;
    },
    setOrdersCurrentPage: (state, action: PayloadAction<number>) => {
      state.ordersCurrentPage = action.payload;
    },
    setOrdersCurrentFilter: (state, action: PayloadAction<"ALL" | OrderStatus | undefined>) => {
      state.ordersCurrentFilter = action.payload;
    },
  },
});

export const { setOrders, setOrdersTotalPages, setOrdersCurrentPage, setOrdersCurrentFilter } = ordersSlice.actions;

export default ordersSlice.reducer;

export const fetchOrders = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getOrderList(
      20,
      page - 1,
      // @ts-ignore
      state().orders.ordersCurrentFilter === "ALL" ? undefined : state().orders.ordersCurrentFilter
    )
    .then((response) => {
      dispatch(setOrders(response.data.orderList));
      dispatch(setOrdersCurrentPage(page));
      dispatch(setOrdersTotalPages(response.data.totalAmountOfPages));
    })
    .catch(() =>
      dispatch(
        showSnackbar({
          message: i18n.t("failedToLoadOrders"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};
