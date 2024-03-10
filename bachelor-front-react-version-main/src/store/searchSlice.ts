import {
  AutocompleteProductResponseInner,
  BusinessForPublicResponse,
  FilterProductBy,
  Product,
  SortProductBy,
} from "../generated-sources/openapi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { api } from "../service/apiClient";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import i18n from "i18next";
import qs from "qs";

export interface State {
  keyword: string;
  miniSearchResults: AutocompleteProductResponseInner[];
  searchResults: any[];
  searchedKeyword: string | null;

  businessPages: BusinessForPublicResponse[] | undefined;
  businessPagesCurrentPage: number;
  totalBusinessPagesPagesOnServer: number | undefined;

  products: Product[];
  totalProductsOnServer: number | undefined;
  productsCurrentPage: number;
}

const initialState: State = {
  keyword: "",
  miniSearchResults: [],
  searchResults: [],
  searchedKeyword: null,

  businessPages: [],
  businessPagesCurrentPage: -1,
  totalBusinessPagesPagesOnServer: -1,

  products: [],
  totalProductsOnServer: -1,
  productsCurrentPage: -1,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[] | undefined>) => {
      state.products = action.payload || [];
    },
    setProductsCurrentPage: (state, action: PayloadAction<number>) => {
      state.productsCurrentPage = action.payload;
    },
    setTotalProductsOnServer: (state, action: PayloadAction<number | undefined>) => {
      state.totalProductsOnServer = action.payload;
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setMiniSearchResults: (state, action: PayloadAction<AutocompleteProductResponseInner[]>) => {
      state.miniSearchResults = action.payload;
    },
    setBusinessPages: (state, action: PayloadAction<BusinessForPublicResponse[] | undefined>) => {
      state.businessPages = action.payload;
    },
    setBusinessPagesCurrentPage: (state, action: PayloadAction<number>) => {
      state.businessPagesCurrentPage = action.payload;
    },
    setTotalBusinessPagesOnServer: (state, action: PayloadAction<number | undefined>) => {
      state.totalBusinessPagesPagesOnServer = action.payload;
    },
    resetBusinessPagesPagination: (state) => {
      state.businessPages = [];
      state.businessPagesCurrentPage = -1;
      state.totalBusinessPagesPagesOnServer = -1;
    },
    resetProductsPagination: (state) => {
      state.productsCurrentPage = -1;
      state.totalProductsOnServer = -1;
    },
  },
});

export const {
  setProducts,
  setProductsCurrentPage,
  setTotalProductsOnServer,
  setKeyword,
  setMiniSearchResults,
  setBusinessPages,
  setBusinessPagesCurrentPage,
  setTotalBusinessPagesOnServer,
  resetBusinessPagesPagination,
  resetProductsPagination,
} = searchSlice.actions;

export default searchSlice.reducer;

export const searchMini = () => (dispatch: AppDispatch, state: () => RootState) => {
  return api.publicApi
    .searchAutocompleteProduct(state().search.keyword)
    .then((response) => dispatch(setMiniSearchResults(response.data)));
};

export const fetchBusinessPages =
  (keyword: string, isWithPaginationReset: boolean = false) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    isWithPaginationReset && dispatch(resetBusinessPagesPagination());
    return api.publicApi
      .searchBusiness(keyword, 4, state().search.businessPagesCurrentPage + 1)
      .then((response) => {
        // @ts-ignore
        dispatch(setBusinessPages(state().search.businessPages.concat(response.data.businessPageList)));
        dispatch(setBusinessPagesCurrentPage(state().search.businessPagesCurrentPage + 1));
        dispatch(setTotalBusinessPagesOnServer(response.data.totalAmountOfPages));
      })
      .catch((error) =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToLoadCompanies"),
            type: "error",
          })
        )
      );
  };

export const fetchProducts =
  (keyword: string, sorting: SortProductBy, filtering: FilterProductBy, isWithPaginationReset: boolean = false) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    isWithPaginationReset && dispatch(resetProductsPagination());
    dispatch(showLoadingOverlay({ isInstant: false }));
    return api.publicApi
      .searchProduct(keyword, 20, state().search.productsCurrentPage + 1, sorting, undefined, {
        params: { inStock: filtering.inStock, category: filtering.category },
        // @ts-ignore
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      })
      .then((response) => {
        if (isWithPaginationReset) {
          dispatch(setProducts(response.data.productList));
        } else {
          // @ts-ignore
          dispatch(setProducts(state().search.products.concat(response.data.productList)));
        }
        dispatch(setProductsCurrentPage(state().search.productsCurrentPage + 1));
        dispatch(setTotalProductsOnServer(response.data.totalAmountOfElements));
      })
      .catch((error) =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToLoadProducts"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()));
  };
