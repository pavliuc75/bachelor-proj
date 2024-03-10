import VueI18n from "vue-i18n";
import Vue from "vue";
import en from "@/translations/en";
import ro from "@/translations/ro";

Vue.use(VueI18n);

export default new VueI18n({
  locale: localStorage.getItem('locale') || process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: localStorage.getItem('fallbackLocale') || process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: {
    en,
    ro,
  },
});
