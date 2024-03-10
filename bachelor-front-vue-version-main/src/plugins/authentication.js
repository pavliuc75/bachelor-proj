import Keycloak from "keycloak-js";

const options = {
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_KEYCLOAK_REALM,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID,
  onLoad: process.env.VUE_APP_KEYCLOAK_ON_LOAD_ACTION,
};

const _keycloak = Keycloak(options);

const Plugin = {
  install(Vue) {
    Vue.$keycloak = _keycloak;
  },
};

Plugin.install = (vue) => {
  vue.$keycloak = _keycloak;
  Object.defineProperties(vue.prototype, {
    $keycloak: {
      get() {
        return _keycloak;
      },
    },
  });
};

export default Plugin;
