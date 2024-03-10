import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";
import qs from "qs";

const state = {
  keyword: "",
  miniSearchResults: [],
  searchResults: [],
  searchedKeyword: null,

  businessPages: [],
  businessPagesCurrentPage: -1,
  totalBusinessPagesPagesOnServer: -1,

  products: [],
  totalProductsOnServer: -1,
  productsCurrentPage: -1
};

const getters = {};

const actions = {
  searchMini({ commit, dispatch, state }) {
    return api.publicApi.searchAutocompleteProduct(state.keyword)
      .then(response => commit("setMiniSearchResults", response.data));
  },
  fetchBusinessPages({ commit, dispatch, state }, { keyword, isWithPaginationReset = false }) {
    isWithPaginationReset && commit("resetBusinessPagesPagination");
    return api.publicApi.searchBusiness(keyword, 4, state.businessPagesCurrentPage + 1)
      .then(response => {
        commit("setBusinessPages", state.businessPages.concat(response.data.businessPageList));
        commit("setBusinessPagesCurrentPage", state.businessPagesCurrentPage + 1);
        commit("setTotalBusinessPagesOnServer", response.data.totalAmountOfPages);
      })
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadCompanies"),
        type: "error"
      }, { root: true }));
  },
  fetchProducts({ commit, dispatch, state }, { keyword, sorting, filtering, isWithPaginationReset = false }) {
    isWithPaginationReset && commit("resetProductsPagination");
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.publicApi.searchProduct(keyword, 20, state.productsCurrentPage + 1, sorting, undefined, {
      params: { inStock: filtering.inStock, category: filtering.category },
      paramsSerializer: params => {
        return qs.stringify(params);
      }
    })
      .then(response => {
        if (isWithPaginationReset)
          commit("setProducts", response.data.productList);
        else
          commit("setProducts", state.products.concat(response.data.productList));
        commit("setProductsCurrentPage", state.productsCurrentPage + 1);
        commit("setTotalProductsOnServer", response.data.totalAmountOfElements);
      })
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadProducts"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }
};

const mutations = {
  setProducts: (state, products) => state.products = products,
  setProductsCurrentPage: (state, currentPage) => state.productsCurrentPage = currentPage,
  setTotalProductsOnServer: (state, totalProductsOnServer) => state.totalProductsOnServer = totalProductsOnServer,
  setKeyword: (state, keyword) => state.keyword = keyword,
  setMiniSearchResults: (state, miniSearchResults) => state.miniSearchResults = miniSearchResults,
  setBusinessPages: (state, businessPages) => state.businessPages = businessPages,
  setBusinessPagesCurrentPage: (state, businessPagesCurrentPage) => (state.businessPagesCurrentPage = businessPagesCurrentPage),
  setTotalBusinessPagesOnServer: (state, totalBusinessPagesPagesOnServer) => (state.totalBusinessPagesPagesOnServer = totalBusinessPagesPagesOnServer),
  resetBusinessPagesPagination: (state) => {
    state.businessPages = [];
    state.businessPagesCurrentPage = -1;
    state.totalBusinessPagesPagesOnServer = -1;
  },
  resetProductsPagination: (state) => {
    state.productsCurrentPage = -1;
    state.totalProductsOnServer = -1;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
