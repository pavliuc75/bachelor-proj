import Vue from "vue";
import Vuex from "vuex";
import eventModule from "@/store/eventModule";
import userModule from "@/store/userModule";
import businessModule from "@/store/businessModule";
import administratorManagementToolModule from "@/store/administratorManagementToolModule";
import businessManagementToolModule from "@/store/businessManagementToolModule";
import productModule from "@/store/productModule";
import searchModule from "@/store/searchModule";
import cartModule from "@/store/cartModule";
import ordersModule from "@/store/ordersModule";
import favoritesModule from "@/store/favoritesModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    eventModule,
    userModule,
    businessModule,
    administratorManagementToolModule,
    businessManagementToolModule,
    productModule,
    searchModule,
    cartModule,
    ordersModule,
    favoritesModule,
  }
});
