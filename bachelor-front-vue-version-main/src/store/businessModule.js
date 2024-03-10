import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";

const state = {
  businessPage: null,

  businessPages: [],
  businessPagesCurrentPage: -1,
  totalBusinessPagesPagesOnServer: -1,

  businessProducts: [],
  businessProductsCurrentPage: -1,
  totalBusinessProductsOnServer: -1,
  isBusinessProductsLoading: false,

  businessAnalytics: null
};

const getters = {};

const actions = {
  fetchPublicBusinessAnalytics({ commit, dispatch, state }, businessId) {
    return api.publicApi.getPublicBusinessAnalytics(businessId).then(response => {
      commit("setBusinessAnalytics", {...response.data, businessId: state.businessPage.id});
    })
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToGetBusinessAnalytics"),
        type: "error"
      }, { root: true }));
  },
  fetchBusinessPages({ commit, dispatch, state }, pageSize = 15) {
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.publicApi.getBusinessListForPublic(pageSize, state.businessPagesCurrentPage + 1)
      .then(response => {
        commit("setBusinessPages", state.businessPages.concat(response.data.businessPageList));
        commit("setBusinessPagesCurrentPage", state.businessPagesCurrentPage + 1);
        commit("setTotalBusinessPagesOnServer", response.data.totalAmountOfPages);
      })
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchBusinessPage({ commit, dispatch }, businessPageId) {
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.publicApi.getBusinessForPublicById(businessPageId)
      .then(response => commit("setBusinessPage", response.data))
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchBusinessProducts({ commit, dispatch, state }, isFirstLoad) {
    isFirstLoad && commit("resetBusinessProductsPagination");
    isFirstLoad && commit("setBusinessProductsLoading", true);
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.privateApi.getProductsByBusiness(20, state.businessProductsCurrentPage + 1, state.businessPage.id)
      .then(response => {
        if (isFirstLoad) {
          commit("setBusinessProducts", response.data.productList.map(product => ({
            ...product,
            businessPageId: state.businessPage.id
          })));
        } else {
          commit("setBusinessProducts", state.businessProducts.concat(response.data.productList.map(product => ({
            ...product,
            businessPageId: state.businessPage.id
          }))));
        }
        commit("setTotalBusinessProductsOnServer", response.data.totalAmountOfElements);
        commit("setBusinessProductsCurrentPage", state.businessProductsCurrentPage + 1);
      })
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrongWhileLoadingProducts"),
        type: "error"
      }, { root: true }))
      .finally(() => {
        commit("setBusinessProductsLoading", false);
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  }
};

const mutations = {
  setBusinessAnalytics: (state, businessAnalytics) => state.businessAnalytics = businessAnalytics,
  resetBusinessProductsPagination: state => {
    state.businessProductsCurrentPage = -1;
    state.totalBusinessProductsOnServer = -1;
  },
  setBusinessProductsCurrentPage: (state, currentPage) => state.businessProductsCurrentPage = currentPage,
  setBusinessProductsLoading: (state, isLoading) => (state.isBusinessProductsLoading = isLoading),
  setBusinessProducts: (state, businessProducts) => state.businessProducts = businessProducts,
  setTotalBusinessProductsOnServer: (state, totalBusinessProductsOnServer) => state.totalBusinessProductsOnServer = totalBusinessProductsOnServer,
  setBusinessPage: (state, businessPage) => state.businessPage = businessPage,
  setBusinessPages: (state, businessPages) => (state.businessPages = businessPages),
  setBusinessPagesCurrentPage: (state, businessPagesCurrentPage) => (state.businessPagesCurrentPage = businessPagesCurrentPage),
  setTotalBusinessPagesOnServer: (state, totalBusinessPagesPagesOnServer) => (state.totalBusinessPagesPagesOnServer = totalBusinessPagesPagesOnServer)
};

export default {
  namespaced: true, state, getters, actions, mutations
};
