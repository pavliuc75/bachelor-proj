import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./index";
import {
  CloseSupportThreadRequest,
  CreateNewSupportThreadRequest,
  CreateNewThreadReplyRequest,
  NewUserRequest,
} from "../generated-sources/openapi";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "./eventSlice";
import { api } from "../service/apiClient";
import i18n from "i18next";
import keycloak from "../authentication/keycloak";
import { setIsCartLoading, setProducts } from "./cartSlice";
import { setFavorites, setFavoritesLoading } from "./favoritesSlice";

export interface State {
  isCurrentSocialUserAlreadyCreated: boolean;

  ratedProducts: any[];
}

const initialState: State = {
  isCurrentSocialUserAlreadyCreated: false,

  ratedProducts: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRatedProducts: (state, action: PayloadAction<any[]>) => {
      state.ratedProducts = action.payload;
    },
    setIsCurrentSocialUserAlreadyCreated: (state, action: PayloadAction<boolean>) => {
      state.isCurrentSocialUserAlreadyCreated = action.payload;
    },
  },
});

export const { setRatedProducts, setIsCurrentSocialUserAlreadyCreated } = userSlice.actions;

export default userSlice.reducer;

export const createSupportThread =
  (createNewSupportThreadRequest: CreateNewSupportThreadRequest) => (dispatch: AppDispatch, state: () => RootState) => {
    dispatch(showLoadingOverlay({ isInstant: true }));
    return api.privateApi
      .createSupportThread(createNewSupportThreadRequest)
      .catch((error) => {
        dispatch(
          showSnackbar({
            message: i18n.t("failedToInitiateDiscussion"),
            type: "error",
          })
        );
        throw {};
      })
      .finally(() => dispatch(hideLoadingOverlay()));
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

export const createThreadReply =
  (createThreadReplyRequest: CreateNewThreadReplyRequest) => (dispatch: AppDispatch, state: () => RootState) => {
    return api.privateApi.createThreadReplyForGivenThread(createThreadReplyRequest);
  };

export const fetchMessages = (threadId: string) => (dispatch: AppDispatch, state: () => RootState) => {
  return api.privateApi.getThreadRepliesPage(999, 0, threadId);
};

export const fetchCurrentSupportThread = () => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: true }));
  return api.privateApi
    .getActiveSupportThreadForCurrentUser()
    .catch((error) => {
      dispatch(
        showSnackbar({
          message: i18n.t("failedToLoadDiscussion"),
          type: "error",
        })
      );
    })
    .finally(() => dispatch(hideLoadingOverlay()));
};

export const createUser = (user: NewUserRequest) => (dispatch: AppDispatch, state: () => RootState) => {
  dispatch(showLoadingOverlay({ isInstant: false }));
  return api.publicApi.createUser(user).finally(() => dispatch(hideLoadingOverlay()));
};

export const tryCreateSocialUser = () => (dispatch: AppDispatch, state: () => RootState) => {
  if (!state().user.isCurrentSocialUserAlreadyCreated) {
    api.privateApi
      .createSocialUser({
        // @ts-ignore
        firstName: keycloak.idTokenParsed.given_name,
        // @ts-ignore
        lastName: keycloak.idTokenParsed.family_name,
        // @ts-ignore
        email: keycloak.idTokenParsed.email,
      })
      .catch((error) => {
        if (error.response.status === 409) {
          dispatch(setIsCurrentSocialUserAlreadyCreated(true));
        } else {
          console.warn(error);
        }
      });
  }
};

export const fetchCurrentUserData = () => (dispatch: AppDispatch, state: () => RootState) => {
  // eslint-disable-next-line no-restricted-globals
  location.href.includes("cart") && dispatch(setIsCartLoading(true));
  // eslint-disable-next-line no-restricted-globals
  location.href.includes("favorites") && dispatch(setFavoritesLoading(true));
  // eslint-disable-next-line no-restricted-globals
  (location.href.includes("cart") || location.href.includes("favorites")) &&
    dispatch(showLoadingOverlay({ isInstant: false }));
  return api.privateApi
    .getCurrentUserInfo()
    .then((response) => {
      dispatch(setFavorites(response.data.wishlist?.wishlist || []));
      dispatch(setProducts(response.data.cart?.products || []));
      dispatch(setRatedProducts(response.data.ratedProductList || []));
    })
    .catch((error) =>
      dispatch(
        showSnackbar({
          message: i18n.t("somethingWentWrong"),
          type: "error",
        })
      )
    )
    .finally(() => {
      // eslint-disable-next-line no-restricted-globals
      (location.href.includes("cart") || location.href.includes("favorites")) && dispatch(hideLoadingOverlay());
      // eslint-disable-next-line no-restricted-globals
      location.href.includes("favorites") && dispatch(setFavoritesLoading(false));
      // eslint-disable-next-line no-restricted-globals
      location.href.includes("cart") && dispatch(setIsCartLoading(false));
    });
};
