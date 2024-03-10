import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import i18n from "i18next";
import { api } from "../service/apiClient";
import { Product } from "../generated-sources/openapi";
import keycloak from "../authentication/keycloak";
import { addProductToCart, removeProductFromCart } from "./cartSlice";

export interface State {
  favorites: Product[] | undefined;
  isFavoritesLoading: boolean;
}

const initialState: State = {
  favorites: [],
  isFavoritesLoading: false,
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Product[] | undefined>) => {
      state.favorites = action.payload;
    },
    setFavoritesLoading: (state, action: PayloadAction<boolean>) => {
      state.isFavoritesLoading = action.payload;
    },
  },
});

export const { setFavorites, setFavoritesLoading } = favoritesSlice.actions;

export default favoritesSlice.reducer;

export const addProductToFavorites = (productId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: false }));
  return api.privateApi
    .addProductToWishlist({ productId: productId })
    .then((response) => dispatch(setFavorites(response.data.wishlist)))
    .catch((error) => {
      dispatch(
        showSnackbar({
          message: i18n.t("failedToAddProductToFavorites"),
          type: "error",
        })
      );
      throw {};
    })
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const removeProductFromFavorites =
  (productId: string, isInstantLoading: boolean) => (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: isInstantLoading }));
    return api.privateApi
      .removeProductFromWishlist({ productId: productId })
      .then((response) => dispatch(setFavorites(response.data.wishlist)))
      .catch((error) => {
        dispatch(
          showSnackbar({
            message: i18n.t("failedToRemoveProductFromFavorites"),
            type: "error",
          })
        );
        throw {};
      })
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const handleProductFavoriteAction = (productId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  if (keycloak.authenticated) {
    if (state().favorites.favorites?.some((product) => product?.id === productId)) {
      dispatch(removeProductFromFavorites(productId, false));
    } else {
      dispatch(addProductToFavorites(productId));
    }
  } else {
    // eslint-disable-next-line no-restricted-globals
    keycloak.login({ redirectUri: process.env.REACT_APP_URL + location.pathname });
  }
};
