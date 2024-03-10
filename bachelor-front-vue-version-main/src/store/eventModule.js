const state = {
  snackbar: {
    message: null, isShown: false, type: "info"
  }, loadingOverlay: {
    isShown: false, isInstant: false
  }
};

const getters = {};

const actions = {
  showSnackbar({ commit }, { message, type }) {
    commit("setSnackbar", {
      message: message, type: type || "info", isShown: true
    });
  }, hideSnackbar({ commit }) {
    commit("setSnackbar", { isShown: false });
  }, showLoadingOverlay({ commit }, params = { isInstant: false }) {
    commit("setLoadingOverlay", {
      ...params, isShown: true
    });
  }, hideLoadingOverlay({ commit }) {
    commit("setLoadingOverlay", { isShown: false });
  }
};

const mutations = {
  setSnackbar: (state, snackbarOptions) => (state.snackbar = snackbarOptions),
  setLoadingOverlay: (state, loadingOverlayOptions) => (state.loadingOverlay = loadingOverlayOptions)
};

export default {
  namespaced: true, state, getters, actions, mutations
};
