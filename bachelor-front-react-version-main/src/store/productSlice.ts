import {
  Category,
  FilterProductBy,
  Product,
  SortProductBy,
  Comment,
  CreateNewCommentRequest,
  CreateNewCommentReplyRequest,
} from "../generated-sources/openapi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import { api } from "../service/apiClient";
import i18n from "i18next";
import qs from "qs";

export interface State {
  categories: Category[];
  product: Product | undefined;

  products: Product[] | undefined;
  totalProductsOnServer: number | undefined;
  productsCurrentPage: number;
  isProductsLoading: boolean;

  baseViewLatestRouteQuery: string | undefined;

  comments: (Comment & { productId?: string })[] | undefined;
  isCommentsLoading: boolean;
}

const initialState: State = {
  categories: [],
  product: undefined,

  products: [],
  totalProductsOnServer: -1,
  productsCurrentPage: -1,
  isProductsLoading: false,

  baseViewLatestRouteQuery: undefined,

  comments: [],
  isCommentsLoading: false,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<(Comment & { productId?: string })[] | undefined>) => {
      state.comments = action.payload;
    },
    setCommentsLoading: (state, action: PayloadAction<boolean>) => {
      state.isCommentsLoading = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[] | undefined>) => {
      state.products = action.payload;
    },
    setProductsCurrentPage: (state, action: PayloadAction<number>) => {
      state.productsCurrentPage = action.payload;
    },
    setTotalProductsOnServer: (state, action: PayloadAction<number | undefined>) => {
      state.totalProductsOnServer = action.payload;
    },
    setProduct: (state, action: PayloadAction<Product | undefined>) => {
      state.product = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[] | undefined>) => {
      state.categories = action.payload || [];
    },
    resetProductsPagination: (state) => {
      state.productsCurrentPage = -1;
      state.totalProductsOnServer = -1;
    },
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.isProductsLoading = action.payload;
    },
    setBaseViewLatestRouteQuery: (state, action: PayloadAction<string | undefined>) => {
      state.baseViewLatestRouteQuery = action.payload;
    },
  },
});

export const {
  setComments,
  setCommentsLoading,
  setProducts,
  setProductsCurrentPage,
  setTotalProductsOnServer,
  setProduct,
  setCategories,
  resetProductsPagination,
  setProductsLoading,
  setBaseViewLatestRouteQuery,
} = productSlice.actions;

export default productSlice.reducer;

export const fetchProduct = (productId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: false }));
  return api.publicApi
    .getProductById(productId)
    .then((response) => dispatch(setProduct(response.data)))
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

export const fetchCategories =
  (isLoadingShown: boolean = false) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    if (isLoadingShown) {
      dispatch(showLoadingOverlay({ isInstant: false }));
    }
    return api.publicApi
      .getCategoryList(999, 0)
      .then((response) => dispatch(setCategories(response.data.categoryList)))
      .catch((error) =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToLoadCategories"),
            type: "error",
          })
        )
      )
      .finally(() => dispatch(hideLoadingOverlay()));
  };

export const fetchProducts =
  (sorting: SortProductBy, filtering: FilterProductBy, isWithPaginationReset: boolean, isFirstLoad: boolean) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    isWithPaginationReset && dispatch(resetProductsPagination());
    isFirstLoad && dispatch(setProductsLoading(true));
    dispatch(showLoadingOverlay({ isInstant: false }));
    return api.publicApi
      .searchProduct("", 20, state().product.productsCurrentPage + 1, sorting, undefined, {
        params: { inStock: filtering.inStock, category: filtering.category },
        // @ts-ignore
        paramsSerializer: (params: any) => {
          return qs.stringify(params);
        },
      })
      .then((response) => {
        if (isWithPaginationReset) {
          dispatch(setProducts(response.data.productList));
        } else {
          // @ts-ignore
          dispatch(setProducts(state().product.products.concat(response.data.productList)));
        }
        dispatch(setProductsCurrentPage(state().product.productsCurrentPage + 1));
        dispatch(setTotalProductsOnServer(response.data.totalAmountOfElements));
      })
      .catch(() =>
        dispatch(
          showSnackbar({
            message: i18n.t("failedToLoadProducts"),
            type: "error",
          })
        )
      )
      .finally(() => {
        dispatch(setProductsLoading(false));
        dispatch(hideLoadingOverlay());
      });
  };

export const fetchComments =
  (isFirstLoad: boolean = false) =>
  (dispatch: AppDispatch, state: () => RootState) => {
    isFirstLoad && dispatch(setCommentsLoading(true));
    return (
      api.publicApi
        // @ts-ignore
        .getCommentTreeListForProduct(999, 0, state().product.product.id)
        .then((response) => {
          dispatch(
            setComments(
              // @ts-ignore
              response.data.commentTreeList.map((comment) => ({
                ...comment,
                // @ts-ignore
                productId: state().product.product.id,
              }))
            )
          );
        })
        .catch(() =>
          dispatch(
            showSnackbar({
              message: i18n.t("failedToLoadComments"),
              type: "error",
            })
          )
        )
        .finally(() => {
          isFirstLoad && dispatch(setCommentsLoading(false));
        })
    );
  };

export const addComment =
  (createNewCommentRequest: CreateNewCommentRequest) => (dispatch: AppDispatch, state: () => RootState) => {
    return api.privateApi.createNewComment(createNewCommentRequest);
  };

export const addCommentReply =
  (createNewCommentReplyRequest: CreateNewCommentReplyRequest) => (dispatch: AppDispatch, state: () => RootState) => {
    return api.privateApi.createNewCommentReply(createNewCommentReplyRequest);
  };

export const updateRating = (rating: number) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return (
    api.privateApi
      // @ts-ignore
      .rateProduct({ productId: state().product.product.id, rating })
      .then((response) => {
        dispatch(setProduct(response.data));
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            message: i18n.t("failedToLoadComments"),
            type: "error",
          })
        );
        throw {};
      })
      .finally(() => dispatch(hideLoadingOverlay()))
  );
};
