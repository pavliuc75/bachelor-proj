import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import { api } from "../service/apiClient";
import i18n from "i18next";
import { ProductInCart } from "../generated-sources/openapi";
import keycloak from "../authentication/keycloak";

export interface State {
  products: ProductInCart[] | undefined;
  isCartLoading: boolean;
}

const initialState: State = {
  products: [],
  isCartLoading: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductInCart[] | undefined>) => {
      state.products = action.payload;
    },
    setIsCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isCartLoading = action.payload;
    },
  },
});

export const { setProducts, setIsCartLoading } = cartSlice.actions;

export default cartSlice.reducer;

export const checkout = () => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi.createCheckoutSession().finally(() => dispatch(hideLoadingOverlay()));
};

export const fetchCart = () => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: false }));
  return api.privateApi
    .getCart()
    .then((response) => dispatch(setProducts(response.data.products)))
    .catch((error) =>
      dispatch(
        showSnackbar({
          message: i18n.t("failedToLoadTheCart"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const addProductToCart = (productId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: false }));
  return api.privateApi
    .postProductInCart({ id: productId, amount: 1 })
    .then((response) => dispatch(setProducts(response.data.products)))
    .catch((error) => {
      dispatch({
        message: i18n.t("failedToAddProductToCart"),
        type: "error",
      });
      throw {};
    })
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const updateProductAmountInCart =
  (productId: string, amount: number) => (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .updateProductInCart({ productId: productId, amount: amount })
      .then((response) => dispatch(setProducts(response.data.products)))
      .catch((error) => {
        dispatch(
          showSnackbar({
            message: i18n.t("failedToUpdateAmount"),
            type: "error",
          })
        );
        throw {};
      })
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const removeProductFromCart =
  (productId: string, isInstantLoading: boolean) => (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: isInstantLoading }));
    return api.privateApi
      .deleteProductInCart({ productId: productId })
      .then((response) => dispatch(setProducts(response.data.products)))
      .catch((error) => {
        dispatch(
          showSnackbar({
            message: i18n.t("failedToRemoveProductFromCart"),
            type: "error",
          })
        );
        throw {};
      })
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const handleProductCartAction = (productId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  if (keycloak.authenticated) {
    if (state().cart.products?.find((product) => product?.product?.id === productId)) {
      dispatch(removeProductFromCart(productId, false));
    } else {
      dispatch(addProductToCart(productId));
    }
  } else {
    // eslint-disable-next-line no-restricted-globals
    keycloak.login({ redirectUri: process.env.REACT_APP_URL + location.pathname });
  }
};
