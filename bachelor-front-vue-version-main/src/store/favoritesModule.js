import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";

const state = {
  favorites: [], isFavoritesLoading: false
};

const getters = {};
const actions = {
  addProductToFavorites({ commit, dispatch }, productId) {
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.privateApi.addProductToWishlist({ productId: productId })
      .then(response => commit("setFavorites", response.data.wishlist))
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToAddProductToFavorites"),
          type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => {
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  },
  removeProductFromFavorites({ commit, dispatch }, { productId, isInstantLoading }) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: isInstantLoading }, { root: true });
    return api.privateApi.removeProductFromWishlist({ productId: productId })
      .then(response => commit("setFavorites", response.data.wishlist))
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToRemoveProductFromFavorites"),
          type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => {
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  }
};
const mutations = {
  setFavorites: (state, favorites) => state.favorites = favorites,
  setIsFavoritesLoading: (state, isFavoritesLoading) => state.isFavoritesLoading = isFavoritesLoading
};
export default {
  namespaced: true, state, getters, actions, mutations
};