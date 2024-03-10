import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { api } from "../service/apiClient";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import i18n from "i18next";
import { BusinessForPublicResponse, Product, PublicBusinessAnalytics } from "../generated-sources/openapi";

export interface State {
  businessPage: BusinessForPublicResponse | undefined;
  businessPages: BusinessForPublicResponse[] | undefined;
  businessPagesCurrentPage: number;
  totalBusinessPagesPagesOnServer: number;

  businessProducts: Product[] | undefined;
  businessProductsCurrentPage: number;
  totalBusinessProductsOnServer: number;
  isBusinessProductsLoading: boolean;

  businessAnalytics: PublicBusinessAnalytics | undefined; //todo: vue ver has businessId
}

const initialState: State = {
  businessPage: undefined,

  businessPages: [],
  businessPagesCurrentPage: -1,
  totalBusinessPagesPagesOnServer: -1,

  businessProducts: [],
  businessProductsCurrentPage: -1,
  totalBusinessProductsOnServer: -1,
  isBusinessProductsLoading: false,

  businessAnalytics: undefined,
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusinessAnalytics: (state, action: PayloadAction<PublicBusinessAnalytics>) => {
      state.businessAnalytics = action.payload;
    },
    resetBusinessProductsPagination: (state) => {
      state.businessProductsCurrentPage = -1;
      state.totalBusinessProductsOnServer = -1;
    },
    setBusinessProductsCurrentPage: (state, action: PayloadAction<number>) => {
      state.businessProductsCurrentPage = action.payload;
    },
    setBusinessProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.isBusinessProductsLoading = action.payload;
    },
    setBusinessProducts: (state, action: PayloadAction<Product[] | undefined>) => {
      state.businessProducts = action.payload;
    },
    setTotalBusinessProductsOnServer: (state, action: PayloadAction<number | undefined>) => {
      state.totalBusinessProductsOnServer = action.payload || -1;
    },
    setBusinessPage: (state, action: PayloadAction<BusinessForPublicResponse>) => {
      state.businessPage = action.payload;
    },
    setBusinessPages: (state, action: PayloadAction<BusinessForPublicResponse[] | undefined>) => {
      state.businessPages = action.payload;
    },
    setBusinessPagesCurrentPage: (state, action: PayloadAction<number>) => {
      state.businessPagesCurrentPage = action.payload;
    },
    setTotalBusinessPagesOnServer: (state, action: PayloadAction<number | undefined>) => {
      state.totalBusinessPagesPagesOnServer = action.payload || -1;
    },
  },
});

export const {
  setBusinessAnalytics,
  resetBusinessProductsPagination,
  setBusinessProductsCurrentPage,
  setBusinessProductsLoading,
  setBusinessProducts,
  setTotalBusinessProductsOnServer,
  setBusinessPage,
  setBusinessPages,
  setBusinessPagesCurrentPage,
  setTotalBusinessPagesOnServer,
} = businessSlice.actions;

export default businessSlice.reducer;

export const fetchPublicBusinessAnalytics = (businessId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  return api.publicApi
    .getPublicBusinessAnalytics(businessId)
    .then((response) => dispatch(setBusinessAnalytics(response.data)))
    .catch((error) =>
      dispatch(
        showSnackbar({
          message: i18n.t("failedToGetBusinessAnalytics"),
          type: "error",
        })
      )
    );
};

export const fetchBusinessPages =
  (pageSize: number = 15) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: false }));
    return api.publicApi
      .getBusinessListForPublic(pageSize, state().business.businessPagesCurrentPage + 1)
      .then((response) => {
        //@ts-ignore
        dispatch(setBusinessPages(state().business.businessPages.concat(response.data.businessPageList)));
        dispatch(setBusinessPagesCurrentPage(state().business.businessPagesCurrentPage + 1));
        dispatch(setTotalBusinessPagesOnServer(response.data.totalAmountOfPages));
      })
      .catch((error) =>
        dispatch(
          showSnackbar({
            message: i18n.t("somethingWentWrong"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const fetchBusinessPage = (businessPageId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: false }));
  return api.publicApi
    .getBusinessForPublicById(businessPageId)
    .then((response) => dispatch(setBusinessPage(response.data)))
    .catch((error) =>
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      )
    )
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const fetchBusinessProducts = (isFirstLoad: boolean) => (dispatch: AppDispatch, state: () => RootState) => {
  isFirstLoad && dispatch(resetBusinessProductsPagination());
  isFirstLoad && dispatch(setBusinessProductsLoading(true));
  dispatch(showLoadingOverlay({ isInstant: false }));
  return (
    api.privateApi
      // @ts-ignore
      .getProductsByBusiness(20, state().business.businessProductsCurrentPage + 1, state().business.businessPage.id)
      .then((response) => {
        if (isFirstLoad) {
          dispatch(
            setBusinessProducts(
              // @ts-ignore
              response.data.productList.map((product) => ({
                ...product,
                // @ts-ignore
                businessPageId: state().business.businessPage.id,
              }))
            )
          );
        } else {
          dispatch(
            setBusinessProducts(
              // @ts-ignore
              state().business.businessProducts.concat(
                // @ts-ignore
                response.data.productList.map((product) => ({
                  ...product,
                  // @ts-ignore
                  businessPageId: state().business.businessPage.id,
                }))
              )
            )
          );
        }
        dispatch(setTotalBusinessProductsOnServer(response.data.totalAmountOfElements));
        dispatch(setBusinessProductsCurrentPage(state().business.businessProductsCurrentPage + 1));
      })
      .catch((error) =>
        dispatch(
          showSnackbar({
            message: i18n.t("somethingWentWrongWhileLoadingProducts"),
            type: "error",
          })
        )
      )
      .finally(() => {
        dispatch(setBusinessProductsLoading(false));
        dispatch(hideLoadingOverlay());
      })
  );
};
