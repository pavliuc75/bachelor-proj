import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";

const state = {
  products: [],
  isCartLoading: false
};

const getters = {};

const actions = {
  checkout({ commit, dispatch, state }) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.createCheckoutSession()
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchCart({ commit, dispatch }) {
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.privateApi.getCart()
      .then(response => commit("setProducts", response.data.products))
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadTheCart"),
        type: "error"
      }, { root: true }))
      .finally(() => {
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  },
  addProductToCart({ commit, dispatch }, productId) {
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.privateApi.postProductInCart({ id: productId, amount: 1 })
      .then(response => commit("setProducts", response.data.products))
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToAddProductToCart"),
          type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => {
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  },
  updateProductAmount({ commit, dispatch, state }, { productId, amount }) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.updateProductInCart({ productId: productId, amount: amount })
      .then(response => commit("setProducts", response.data.products))
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToUpdateAmount"),
          type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => {
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  },
  removeProductFromCart({ commit, dispatch, state }, { productId, isInstantLoading }) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: isInstantLoading }, { root: true });
    return api.privateApi.deleteProductInCart({ productId: productId })
      .then(response => commit("setProducts", response.data.products))
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToRemoveProductFromCart"),
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
  setProducts: (state, products) => state.products = products,
  setCartLoading: (state, isCartLoading) => state.isCartLoading = isCartLoading
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
