import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { api } from "../service/apiClient";
import {
  Business,
  BusinessApplication,
  Category,
  CategoryApplication,
  CloseSupportThreadRequest,
  CreateBusinessReviewRequest,
  CreateNewThreadReplyRequest,
  HandleCategoryApplicationRequest,
  MarketplaceBusinessAnalytics,
  OrderStatus,
  OrderToFulfill,
  PatchOrderToFulfillProductStatusRequest,
  PatchOrderToFulfillStatusRequest,
  SupportThread,
} from "../generated-sources/openapi";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import i18n from "i18next";

export interface State {
  createBusinessPageRequestsCurrentPage: number;
  createBusinessPageRequestsTotalPages: number;
  createBusinessPageRequests: BusinessApplication[] | undefined;
  businessPagesCurrentPage: number;
  businessPagesTotalPages: number;
  businessPages: Business[] | undefined;
  categoriesCurrentPage: number;
  categoriesTotalPages: number;
  categories: Category[] | undefined;
  createCategoryRequestsCurrentPage: number;
  createCategoryRequestsTotalPages: number;
  createCategoryRequests: CategoryApplication[] | undefined;
  orders: OrderToFulfill[] | undefined;
  ordersTotalPages: number;
  ordersCurrentPage: number;
  ordersCurrentFilter: "ALL" | OrderStatus;
  threads: SupportThread[];
  threadsTotalPages: number;
  threadsCurrentPage: number;
  generalStats: MarketplaceBusinessAnalytics | null;
  isGeneralStatsLoading: boolean;
}

const initialState: State = {
  createBusinessPageRequestsCurrentPage: 1,
  createBusinessPageRequestsTotalPages: 1,
  createBusinessPageRequests: [],

  businessPagesCurrentPage: 1,
  businessPagesTotalPages: 1,
  businessPages: [],

  categoriesCurrentPage: 1,
  categoriesTotalPages: 1,
  categories: [],

  createCategoryRequestsCurrentPage: 1,
  createCategoryRequestsTotalPages: 1,
  createCategoryRequests: [],

  orders: [],
  ordersTotalPages: 1,
  ordersCurrentPage: 1,
  ordersCurrentFilter: "ALL",

  threads: [],
  threadsTotalPages: 1,
  threadsCurrentPage: 1,

  generalStats: null,
  isGeneralStatsLoading: false,
};

export const administratorManagementToolSlice = createSlice({
  name: "administratorManagementTool",
  initialState,
  reducers: {
    setGeneralStats: (state, action: PayloadAction<MarketplaceBusinessAnalytics>) => {
      state.generalStats = action.payload;
    },
    setIsGeneralStatsLoading: (state, action: PayloadAction<boolean>) => {
      state.isGeneralStatsLoading = action.payload;
    },
    setThreads: (state, action: PayloadAction<SupportThread[]>) => {
      state.threads = action.payload;
    },
    setThreadsTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.threadsTotalPages = action.payload || 1;
    },
    setThreadsCurrentPage: (state, action: PayloadAction<number>) => {
      state.threadsCurrentPage = action.payload;
    },

    setCreateCategoryRequests: (state, action: PayloadAction<CategoryApplication[] | undefined>) => {
      state.createCategoryRequests = action.payload;
    },
    setCreateCategoryRequestsCurrentPage: (state, action: PayloadAction<number>) => {
      state.createCategoryRequestsCurrentPage = action.payload;
    },
    setCreateCategoryRequestsTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.createCategoryRequestsTotalPages = action.payload || 1;
    },

    setCategoriesCurrentPage: (state, action: PayloadAction<number>) => {
      state.categoriesCurrentPage = action.payload;
    },
    setCategoriesTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.categoriesTotalPages = action.payload || 1;
    },
    setCategories: (state, action: PayloadAction<Category[] | undefined>) => {
      state.categories = action.payload;
    },

    setBusinessPagesCurrentPage: (state, action: PayloadAction<number>) => {
      state.businessPagesCurrentPage = action.payload;
    },
    setBusinessPagesTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.businessPagesTotalPages = action.payload || 1;
    },
    setBusinessPages: (state, action: PayloadAction<Business[] | undefined>) => {
      state.businessPages = action.payload;
    },
    setCreateBusinessPageRequests: (state, action: PayloadAction<BusinessApplication[] | undefined>) => {
      state.createBusinessPageRequests = action.payload;
    },
    setCreateBusinessPageRequestsCurrentPage: (state, action: PayloadAction<number>) => {
      state.createBusinessPageRequestsCurrentPage = action.payload;
    },
    setCreateBusinessPageRequestsTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.createBusinessPageRequestsTotalPages = action.payload || 1;
    },

    setOrders: (state, action: PayloadAction<OrderToFulfill[] | undefined>) => {
      state.orders = action.payload;
    },
    setOrdersTotalPages: (state, action: PayloadAction<number | undefined>) => {
      state.ordersTotalPages = action.payload || 1;
    },
    setOrdersCurrentPage: (state, action: PayloadAction<number>) => {
      state.ordersCurrentPage = action.payload;
    },
    setOrdersCurrentFilter: (state, action: PayloadAction<"ALL" | OrderStatus>) => {
      state.ordersCurrentFilter = action.payload;
    },
    updateOrderInOrders: (state, action: PayloadAction<OrderToFulfill>) => {
      const order = action.payload;
      let index = state.orders?.findIndex((o) => o.id === order.id);
      if (index !== -1) {
        // @ts-ignore
        state.orders?.splice(index, 1, order);
      }
    },
  },
});

export const {
  setGeneralStats,
  setIsGeneralStatsLoading,
  setThreads,
  setThreadsTotalPages,
  setThreadsCurrentPage,
  setCreateCategoryRequests,
  setCreateCategoryRequestsCurrentPage,
  setCreateCategoryRequestsTotalPages,
  setCategoriesCurrentPage,
  setCategoriesTotalPages,
  setCategories,
  setBusinessPagesCurrentPage,
  setBusinessPagesTotalPages,
  setBusinessPages,
  setCreateBusinessPageRequests,
  setCreateBusinessPageRequestsCurrentPage,
  setCreateBusinessPageRequestsTotalPages,
  setOrders,
  setOrdersTotalPages,
  setOrdersCurrentPage,
  setOrdersCurrentFilter,
  updateOrderInOrders,
} = administratorManagementToolSlice.actions;

export const fetchGeneralStats = () => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(setIsGeneralStatsLoading(true));
  return api.privateApi
    .getMarketplaceAnalytics()
    .then((response) => {
      dispatch(setGeneralStats(response.data));
    })
    .catch((error) => {
      dispatch(
        showSnackbar({
          message: i18n.t("failedToLoadStats"),
          type: "error",
        })
      );
    })
    .finally(() => {
      dispatch(setIsGeneralStatsLoading(false));
    });
};

export const fetchThreads = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getActiveSupportThreadPage(5, page - 1)
    .then((response) => {
      dispatch(setThreads(response.data.SupportThreadPageList));
      dispatch(setThreadsTotalPages(response.data.totalAmountOfPages));
      dispatch(setThreadsCurrentPage(page));
    })
    .catch((error) => {
      dispatch(
        showSnackbar({
          message: i18n.t("failedToLoadThreads"),
          type: "error",
        })
      );
    })
    .finally(() => {
      dispatch(hideLoadingOverlay());
    });
};

export const fetchProducts = (page: number, businessId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getProductsByBusiness(6, page - 1, businessId)
    .then((response) => response.data)
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const fetchCategories = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.publicApi
    .getCategoryList(6, page - 1)
    .then((response) => {
      dispatch(setCategoriesCurrentPage(page));
      dispatch(setCategoriesTotalPages(response.data.totalAmountOfPage));
      dispatch(setCategories(response.data.categoryList));
    })
    .catch(() =>
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const handleCreateCategoryRequest =
  (handleCategoryApplicationRequest: HandleCategoryApplicationRequest) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .handleNewCategoryApplication(handleCategoryApplicationRequest)
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const deleteCategory = (categoryId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi.deleteCategoryById(categoryId).finally(() => dispatch(hideLoadingOverlay()));
};

export const fetchCreateCategoryRequests = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getCategoryApplicationList(6, page - 1)
    .then((response) => {
      dispatch(setCreateCategoryRequests(response.data.categoryApplicationList));
      dispatch(setCreateCategoryRequestsTotalPages(response.data.totalAmountOfPage));
      dispatch(setCreateCategoryRequestsCurrentPage(page));
    })
    .catch(() =>
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const fetchCreateBusinessPageRequests = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getBusinessApplicationList(6, page - 1)
    .then((response) => {
      dispatch(setCreateBusinessPageRequestsCurrentPage(page));
      dispatch(setCreateBusinessPageRequestsTotalPages(response.data.totalAmountOfPages));
      dispatch(setCreateBusinessPageRequests(response.data.businessApplicationPageList));
    })
    .catch(() =>
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const downloadLegalDocument = (fileKey: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .downloadLegalDocument(fileKey)
    .catch(() => {
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      );
      throw {};
    })
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const createBusinessApplicationReview =
  (createBusinessReviewRequest: CreateBusinessReviewRequest) => (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .createBusinessApplicationReview(createBusinessReviewRequest)
      .catch(() => {
        dispatch(
          showSnackbar({
            message: i18n.t("somethingWentWrong"),
            type: "error",
          })
        );
        throw {};
      })
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const fetchBusinessPages = (page: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getBusinessListForAdmin(6, page - 1)
    .then((response) => {
      dispatch(setBusinessPagesCurrentPage(page));
      dispatch(setBusinessPagesTotalPages(response.data.totalAmountOfPages));
      dispatch(setBusinessPages(response.data.businessPageList));
    })
    .catch(() =>
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const deleteProduct = (productId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi.deleteProductById(productId).finally(() => dispatch(hideLoadingOverlay()));
};

export const fetchOrders = (page: number) => {
  return (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .getOrderToFulfillList(
        6,
        page - 1,
        // @ts-ignore
        state().administratorManagementTool.ordersCurrentFilter === "ALL"
          ? undefined
          : state().administratorManagementTool.ordersCurrentFilter
      )
      .then((response) => {
        dispatch(setOrdersCurrentPage(page));
        dispatch(setOrders(response.data.orderList));
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
};

export const updateOrderStatus =
  (patchOrderToFulfillStatusRequest: PatchOrderToFulfillStatusRequest) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .patchOrderToFulfillStatus(patchOrderToFulfillStatusRequest)
      .then((response) => dispatch(updateOrderInOrders(response.data)))
      .catch(() =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToUpdateOrderStatus"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const updateProductStatus =
  (patchOrderToFulfillProductStatusRequest: PatchOrderToFulfillProductStatusRequest) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .patchOrderToFulfillProductStatus(patchOrderToFulfillProductStatusRequest)
      .then((response) => dispatch(updateOrderInOrders(response.data)))
      .catch(() =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToUpdateProductStatus"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const createThreadReply =
  (createThreadReplyRequest: CreateNewThreadReplyRequest) => (dispatch: AppDispatch, state: () => RootState) => {
    return api.privateApi.createThreadReplyForGivenThread(createThreadReplyRequest);
  };

export const fetchMessages = (threadId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  return api.privateApi.getThreadRepliesPage(999, 0, threadId);
};

export const closeSupportThread =
  (closeSupportThreadRequest: CloseSupportThreadRequest) => (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .closeSupportThread(closeSupportThreadRequest)
      .catch((error) => {
        dispatch(
          showSnackbar({
            message: i18n.t("failedToCloseSupportThread"),
            type: "error",
          })
        );
        throw {};
      })
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export default administratorManagementToolSlice.reducer;
