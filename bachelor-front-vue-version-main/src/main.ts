import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import i18n from "@/translations/i18n";
import authentication from "@/plugins/authentication";
import vuetify from "@/plugins/vuetify";

library.add(fas);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(authentication);

// @ts-ignore
Vue.$keycloak.init({ checkLoginIframe: false, onLoad: 'check-sso' }).then(() => initializeVueApp());

function initializeVueApp() {
  new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: (h) => h(App),
  }).$mount("#app");
}
