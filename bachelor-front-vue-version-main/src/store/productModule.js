import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";
import qs from "qs";

const state = {
  categories: [],
  product: null,

  products: [],
  totalProductsOnServer: -1,
  productsCurrentPage: -1,
  isProductsLoading: false,

  baseViewLatestRouteQuery: null,

  comments: [],
  isCommentsLoading: false
};

const getters = {};

const actions = {
  fetchProduct({ commit, dispatch }, productId) {
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.publicApi.getProductById(productId)
      .then((response) => commit("setProduct", response.data))
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchCategories({ commit, dispatch, state }, isLoadingShown = false) {
    isLoadingShown ? dispatch("eventModule/showLoadingOverlay", null, { root: true }) : {};
    return api.publicApi.getCategoryList(999, 0)
      .then(response => commit("setCategories", response.data.categoryList))
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadCategories"),
        type: "error"
      }, { root: true }))
      .finally(() => isLoadingShown ? dispatch("eventModule/hideLoadingOverlay", null, { root: true }) : {});
  },
  fetchProducts({ commit, dispatch, state }, { sorting, filtering, isWithPaginationReset, isFirstLoad }) {
    isWithPaginationReset && commit("resetProductsPagination");
    isFirstLoad && commit("setProductsLoading", true);
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.publicApi.searchProduct("", 20, state.productsCurrentPage + 1, sorting, undefined, {
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
      .finally(() => {
        commit("setProductsLoading", false);
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  },
  fetchComments({ commit, dispatch, state }, isFirstLoad = false) {
    isFirstLoad && commit("setCommentsLoading", true);
    return api.publicApi.getCommentTreeListForProduct(999, 0, state.product.id)
      .then(response => {
        commit("setComments", response.data.commentTreeList.map(comment => ({
          ...comment,
          productId: state.product.id
        })));
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadComments"), type: "error"
      }, { root: true }))
      .finally(() => {
        isFirstLoad && commit("setCommentsLoading", false);
      });
  },
  addComment({ commit, dispatch, state }, createNewCommentRequest) {
    return api.privateApi.createNewComment(createNewCommentRequest);
  },
  addCommentReply({ commit, dispatch, state }, createNewCommentReplyRequest) {
    return api.privateApi.createNewCommentReply(createNewCommentReplyRequest);
  },
  updateRating({ commit, dispatch, state }, rating) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.rateProduct({ productId: state.product.id, rating })
      .then((response) => {
        commit("setProduct", response.data);
      })
      .catch(() => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToLoadComments"), type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }
};

const mutations = {
  setComments: (state, comments) => state.comments = comments,
  setCommentsLoading: (state, isCommentsLoading) => state.isCommentsLoading = isCommentsLoading,

  setProducts: (state, products) => state.products = products,
  setProductsCurrentPage: (state, currentPage) => state.productsCurrentPage = currentPage,
  setTotalProductsOnServer: (state, totalProductsOnServer) => state.totalProductsOnServer = totalProductsOnServer,
  setProduct: (state, product) => state.product = product,
  setCategories: (state, categories) => (state.categories = categories),
  resetProductsPagination: (state) => {
    state.productsCurrentPage = -1;
    state.totalProductsOnServer = -1;
  },
  setProductsLoading: (state, isProductsLoading) => state.isProductsLoading = isProductsLoading,
  setBaseViewLatestRouteQuery: (state, baseViewLatestRouteQuery) => state.baseViewLatestRouteQuery = baseViewLatestRouteQuery
};

export default {
  namespaced: true, state, getters, actions, mutations
};
