import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";

const state = {
  createBusinessPageRequestsCurrentPage: 1, createBusinessPageRequestsTotalPages: 1, createBusinessPageRequests: [],

  businessPagesCurrentPage: 1, businessPagesTotalPages: 1, businessPages: [],

  categoriesCurrentPage: 1, categoriesTotalPages: 1, categories: [],

  createCategoryRequestsCurrentPage: 1, createCategoryRequestsTotalPages: 1, createCategoryRequests: [],

  orders: [], ordersTotalPages: 1, ordersCurrentPage: 1, ordersCurrentFilter: "ALL",

  threads: [], threadsTotalPages: 1, threadsCurrentPage: 1,

  generalStats: null, isGeneralStatsLoading: false,
};

const getters = {};

const actions = {
  fetchGeneralStats({ commit, dispatch }) {
    commit("setGeneralStatsLoading", true);
    return api.privateApi.getMarketplaceAnalytics()
      .then(response => {
        commit("setGeneralStats", response.data);
      })
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToLoadStats"),
          type: "error"
        }, { root: true });
      })
      .finally(() => {
        commit("setGeneralStatsLoading", false);
      });
  },
  fetchThreads({ commit, dispatch, state }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.getActiveSupportThreadPage(5, page - 1)
      .then(response => {
        commit("setThreads", response.data.SupportThreadPageList);
        commit("setThreadsTotalPages", response.data.totalAmountOfPages);
        commit("setThreadsCurrentPage", page);
      })
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToLoadThreads"),
          type: "error"
        }, { root: true });
      })
      .finally(() => {
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  },
  fetchProducts({ commit, dispatch, state }, { page, businessId }) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.getProductsByBusiness(6, page - 1, businessId)
      .then((response) => response.data)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchCategories({ commit, dispatch }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.publicApi
      .getCategoryList(6, page - 1)
      .then((response) => {
        commit("setCategoriesCurrentPage", page);
        commit("setCategoriesTotalPages", response.data.totalAmountOfPage);
        commit("setCategories", response.data.categoryList);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  handleCreateCategoryRequest({ dispatch }, handleCategoryApplicationRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.handleNewCategoryApplication(handleCategoryApplicationRequest)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  deleteCategory({ dispatch }, categoryId) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.deleteCategoryById(categoryId)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchCreateCategoryRequests({ commit, dispatch }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.getCategoryApplicationList(6, page - 1)
      .then((response) => {
        commit("setCreateCategoryRequests", response.data.categoryApplicationList);
        commit("setCreateCategoryRequestsTotalPages", response.data.totalAmountOfPage);
        commit("setCreateCategoryRequestsCurrentPage", page);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchCreateBusinessPageRequests({ commit, dispatch }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi
      .getBusinessApplicationList(6, page - 1)
      .then((response) => {
        commit("setCreateBusinessPageRequestsCurrentPage", page);
        commit("setCreateBusinessPageRequestsTotalPages", response.data.totalAmountOfPages);
        commit("setCreateBusinessPageRequests", response.data.businessApplicationPageList);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, downloadLegalDocument({ dispatch }, fileKey) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.downloadLegalDocument(fileKey)
      .catch(() => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("somethingWentWrong"), type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, createBusinessApplicationReview({ dispatch }, createBusinessReviewRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.createBusinessApplicationReview(createBusinessReviewRequest)
      .catch(() => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("somethingWentWrong"), type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, fetchBusinessPages({ commit, dispatch }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi
      .getBusinessListForAdmin(6, page - 1)
      .then((response) => {
        commit("setBusinessPagesCurrentPage", page);
        commit("setBusinessPagesTotalPages", response.data.totalAmountOfPages);
        commit("setBusinessPages", response.data.businessPageList);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  }, deleteProduct({ dispatch }, productId) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.deleteProductById(productId)
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  fetchOrders({ commit, dispatch, state }, page) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.getOrderToFulfillList(6, page - 1, state.ordersCurrentFilter === "ALL" ? undefined : state.ordersCurrentFilter)
      .then(response => {
        commit("setOrdersCurrentPage", page);
        commit("setOrders", response.data.orderList);
        commit("setOrdersTotalPages", response.data.totalAmountOfPages);
      })
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToLoadOrders"), type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  updateOrderStatus({ commit, dispatch, state }, patchOrderToFulfillStatusRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.patchOrderToFulfillStatus(patchOrderToFulfillStatusRequest)
      .then((response) => commit("updateOrderInOrders", response.data))
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToUpdateOrderStatus"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  updateProductStatus({ commit, dispatch, state }, patchOrderToFulfillProductStatusRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.patchOrderToFulfillProductStatus(patchOrderToFulfillProductStatusRequest)
      .then((response) => commit("updateOrderInOrders", response.data))
      .catch(() => dispatch("eventModule/showSnackbar", {
        message: i18n.t("failedToUpdateProductStatus"),
        type: "error"
      }, { root: true }))
      .finally(() => dispatch("eventModule/hideLoadingOverlay", null, { root: true }));
  },
  createThreadReply({ commit, dispatch, state }, createThreadReplyRequest) {
    return api.privateApi.createThreadReplyForGivenThread(createThreadReplyRequest);
  },

  fetchMessages({ commit, dispatch, state }, threadId) {
    return api.privateApi.getThreadRepliesPage(999, 0, threadId);
  },

  closeSupportThread({ commit, dispatch, state }, closeSupportThreadRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.closeSupportThread(closeSupportThreadRequest)
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToCloseSupportThread"),
          type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() =>
        dispatch("eventModule/hideLoadingOverlay", null, { root: true })
      );
  }
};

const mutations = {
  setGeneralStats: (state, generalStats) => (state.generalStats = generalStats),
  setGeneralStatsLoading: (state, generalStatsLoading) => (state.isGeneralStatsLoading = generalStatsLoading),
  setThreads: (state, threads) => state.threads = threads,
  setThreadsTotalPages: (state, totalPages) => state.threadsTotalPages = totalPages,
  setThreadsCurrentPage: (state, currentPage) => state.threadsCurrentPage = currentPage,

  setCreateCategoryRequests: (state, createCategoryRequests) => state.createCategoryRequests = createCategoryRequests,
  setCreateCategoryRequestsCurrentPage: (state, createCategoryRequestsCurrentPage) => state.createCategoryRequestsCurrentPage = createCategoryRequestsCurrentPage,
  setCreateCategoryRequestsTotalPages: (state, createCategoryRequestsTotalPages) => state.createCategoryRequestsTotalPages = createCategoryRequestsTotalPages,

  setCategoriesCurrentPage: (state, page) => state.categoriesCurrentPage = page,
  setCategoriesTotalPages: (state, totalPages) => state.categoriesTotalPages = totalPages,
  setCategories: (state, categories) => state.categories = categories,

  setBusinessPagesCurrentPage: (state, page) => state.businessPagesCurrentPage = page,
  setBusinessPagesTotalPages: (state, totalPages) => state.businessPagesTotalPages = totalPages,
  setBusinessPages: (state, businessPages) => state.businessPages = businessPages,
  setCreateBusinessPageRequests: (state, createBusinessPageRequests) => (state.createBusinessPageRequests = createBusinessPageRequests),
  setCreateBusinessPageRequestsCurrentPage: (state, createBusinessPageRequestsCurrentPage) => (state.createBusinessPageRequestsCurrentPage = createBusinessPageRequestsCurrentPage),
  setCreateBusinessPageRequestsTotalPages: (state, createBusinessPageRequestsTotalPages) => (state.createBusinessPageRequestsTotalPages = createBusinessPageRequestsTotalPages),

  setOrders: (state, orders) => state.orders = orders,
  setOrdersTotalPages: (state, totalPages) => state.ordersTotalPages = totalPages,
  setOrdersCurrentPage: (state, currentPage) => state.ordersCurrentPage = currentPage,
  setOrdersCurrentFilter: (state, currentFilter) => state.ordersCurrentFilter = currentFilter,
  updateOrderInOrders: (state, order) => {
    let index = state.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      state.orders.splice(index, 1, order);
    }
  }
};

export default {
  namespaced: true, state, getters, actions, mutations
};
