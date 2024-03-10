import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";

const state = {
  orders: [], ordersTotalPages: 1, ordersCurrentPage: 1, ordersCurrentFilter: "ALL"
};
const getters = {};
const actions = {
  fetchOrders({ commit, dispatch, state }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.getOrderList(20, page - 1,
      state.ordersCurrentFilter === "ALL" ? undefined : state.ordersCurrentFilter)
      .then(response => {
        commit("setOrders", response.data.orderList);
        commit("setOrdersCurrentPage", page);
        commit("setOrdersTotalPages", response.data.totalAmountOfPages);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadOrders"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }
};
const mutations = {
  setOrders: (state, orders) => state.orders = orders,
  setOrdersTotalPages: (state, totalPages) => state.ordersTotalPages = totalPages,
  setOrdersCurrentPage: (state, currentPage) => state.ordersCurrentPage = currentPage,
  setOrdersCurrentFilter: (state, currentFilter) => state.ordersCurrentFilter = currentFilter,
};

export default {
  namespaced: true, state, getters, actions, mutations
};