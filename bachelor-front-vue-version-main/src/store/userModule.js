import Vue from "vue";
import { api } from "@/service/apiClient";
import i18n from "@/translations/i18n";

const state = {
  isCurrentSocialUserAlreadyCreated: false,

  ratedProducts: [],
};

const getters = {};

const actions = {
  createSupportThread({ commit, dispatch, state }, createNewSupportThreadRequest) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.createSupportThread(createNewSupportThreadRequest)
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToInitiateDiscussion"),
          type: "error"
        }, { root: true });
        throw {};
      })
      .finally(() =>
        dispatch("eventModule/hideLoadingOverlay", null, { root: true })
      );
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
  },

  createThreadReply({ commit, dispatch, state }, createThreadReplyRequest) {
    return api.privateApi.createThreadReplyForGivenThread(createThreadReplyRequest);
  },

  fetchMessages({ commit, dispatch, state }, threadId) {
    return api.privateApi.getThreadRepliesPage(999, 0, threadId);
  },

  fetchCurrentSupportThread({ commit, dispatch }) {
    dispatch("eventModule/showLoadingOverlay", { isInstant: true }, { root: true });
    return api.privateApi.getActiveSupportThreadForCurrentUser()
      .catch(error => {
        dispatch("eventModule/showSnackbar", {
          message: i18n.t("failedToLoadDiscussion"),
          type: "error"
        }, { root: true });
      })
      .finally(() => {
        dispatch("eventModule/hideLoadingOverlay", null, { root: true });
      });
  },

  createUser({ commit, dispatch }, user) {
    dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.publicApi
      .createUser(user)
      .finally(() =>
        dispatch("eventModule/hideLoadingOverlay", null, { root: true })
      );
  },

  tryCreateSocialUser({ commit, dispatch, state }) {
    if (!state.isCurrentSocialUserAlreadyCreated) {
      api.privateApi
        .createSocialUser({
          firstName: Vue.$keycloak.idTokenParsed.given_name,
          lastName: Vue.$keycloak.idTokenParsed.family_name,
          email: Vue.$keycloak.idTokenParsed.email
        })
        .catch((error) => {
          if (error.response.status === 409) {
            commit("setIsCurrentSocialUserAlreadyCreated", true);
          } else {
            console.warn(error);
          }
        });
    }
  },

  fetchCurrentUserData({ commit, dispatch }) {
    location.href.includes("cart") && commit("cartModule/setCartLoading", true, { root: true });
    location.href.includes("favorites") && commit("favoritesModule/setIsFavoritesLoading", true, { root: true });
    (location.href.includes("cart") || location.href.includes("favorites")) && dispatch("eventModule/showLoadingOverlay", null, { root: true });
    return api.privateApi.getCurrentUserInfo()
      .then((response) => {
        commit("favoritesModule/setFavorites", response.data.wishlist?.wishlist || [], { root: true });
        commit("cartModule/setProducts", response.data.cart?.products || [], { root: true });
        commit("setRatedProducts", response.data.ratedProductList || []);
      })
      .catch(error => dispatch("eventModule/showSnackbar", {
        message: i18n.t("somethingWentWrong"),
        type: "error"
      }, { root: true }))
      .finally(() => {
        (location.href.includes("cart") || location.href.includes("favorites")) && dispatch("eventModule/hideLoadingOverlay", null, { root: true });
        location.href.includes("favorites") && commit("favoritesModule/setIsFavoritesLoading", false, { root: true });
        location.href.includes("cart") && commit("cartModule/setCartLoading", false, { root: true });
      });
  },
};

const mutations = {
  setRatedProducts: (state, RatedProducts) => state.ratedProducts = RatedProducts,
  setIsCurrentSocialUserAlreadyCreated: (
    state,
    isCurrentSocialUserAlreadyCreated
  ) => {
    state.isCurrentSocialUserAlreadyCreated = isCurrentSocialUserAlreadyCreated;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
