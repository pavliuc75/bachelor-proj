import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const routes = [{
  path: "/", name: "base", component: () => import("../views/BaseView.vue")
}, {
  path: "/create-account", name: "createAccount", component: () => import("../views/CreateAccountView.vue"), meta: {
    limitedNavigationBar: true
  }
}, {
  path: "/create-business-page",
  name: "createBusinessPage",
  component: () => import("../views/CreateBusinessPageView.vue"),
  meta: {
    requiresAuthentication: true
  }
}, {
  path: "/account", name: "account", component: () => import("../views/AccountView.vue"), meta: {
    requiresAuthentication: true
  }
}, {
  path: "/cart", name: "cart", component: () => import("../views/CartView.vue"), meta: {
    requiresAuthentication: true
  }
}, {
  path: "/favorites", name: "favorites", component: () => import("../views/FavoritesView.vue"), meta: {
    requiresAuthentication: true
  }
}, {
  path: "/orders", name: "orders", component: () => import("../views/OrdersView.vue"), meta: {
    requiresAuthentication: true
  }
}, {
  path: "/business-management-tool",
  name: "businessManagementTool",
  component: () => import("../views/BusinessManagementToolView.vue"),
  beforeEnter: (to, from, next) => {
    if (Vue.$keycloak?.realmAccess?.roles?.includes("BUSINESS_OWNER")) next(); else next("/error");
  },
  children: [{
    path: "", name: "businessManagementToolBase", redirect: "edit-business-page"
  }, {
    path: "edit-business-page",
    name: "businessManagementToolEditBusinessPage",
    component: () => import("../views/BusinessManagementToolViewEditBusinessPage.vue"),
    meta: {
      requiresAuthentication: true
    }
  }, {
    path: "products",
    name: "businessManagementToolProducts",
    component: () => import("../views/BusinessManagementToolViewProducts.vue"),
    meta: {
      requiresAuthentication: true
    }
  }, {
    path: "orders",
    name: "businessManagementToolOrders",
    component: () => import("../views/BusinessManagementToolViewOrders.vue"),
    meta: {
      requiresAuthentication: true
    }
  }, {
    path: "other",
    name: "businessManagementToolOther",
    component: () => import("../views/BusinessManagementToolViewOther.vue"),
    meta: {
      requiresAuthentication: true
    }
  }]
}, {
  path: "/administrator-management-tool",
  name: "administratorManagementTool",
  component: () => import("../views/AdministratorManagementToolView.vue"),
  beforeEnter: (to, from, next) => {
    if (Vue.$keycloak?.realmAccess?.roles?.includes("ADMIN")) next(); else next("/error");
  },
  children: [{
    path: "", name: "administratorManagementToolBase", redirect: "create-business-page-requests"
  }, {
    path: "create-business-page-requests",
    name: "administratorManagementToolCreateBusinessPageRequests",
    component: () => import(
      "../views/AdministratorManagementToolViewCreateBusinessPageRequests.vue"
      ),
    meta: {
      requiresAuthentication: true
    }
  }, {
    path: "business-pages", name: "administratorManagementToolBusinessPages", component: () => import(
      "../views/AdministratorManagementToolViewBusinessPages.vue"
      ), meta: {
      requiresAuthentication: true
    }
  }, {
    path: "create-category-requests",
    name: "administratorManagementToolCreateCategoryRequests",
    component: () => import(
      "../views/AdministratorManagementToolViewCreateCategoryRequests.vue"
      ),
    meta: {
      requiresAuthentication: true
    }
  }, {
    path: "categories", name: "administratorManagementToolCategories", component: () => import(
      "../views/AdministratorManagementToolViewCategories.vue"
      ), meta: {
      requiresAuthentication: true
    }
  }, {
    path: "orders", name: "administratorManagementToolOrders", component: () => import(
      "../views/AdministratorManagementToolViewOrders.vue"
      ), meta: {
      requiresAuthentication: true
    }
  }, {
    path: "support-discussions", name: "administratorManagementToolSupportDiscussions", component: () => import(
      "../views/AdministratorManagementToolViewSupportDiscussions.vue"
      ), meta: {
      requiresAuthentication: true
    }
  }, {
    path: "stats", name: "administratorManagementToolStats", component: () => import(
      "../views/AdministratorManagementToolViewStats.vue"
      ), meta: {
      requiresAuthentication: true
    }
  }]
}, {
  path: "/business-pages", name: "businessPages", component: () => import("../views/BusinessPagesView.vue")
}, {
  path: "/categories", name: "categories", component: () => import("../views/CategoriesView.vue")
}, {
  path: "/business-page/:businessPageId", name: "businessPage", component: () => import("../views/BusinessPageView.vue")
}, {
  path: "/product/:productId", name: "product", component: () => import("../views/ProductView.vue")
}, {
  name: "search", path: "/search", component: () => import("../views/SearchView.vue")
}, {
  name: "testView", path: "/test", component: () => import("../views/TestView.vue")
}, {
  path: "/page-not-found", name: "pageNotFound", component: () => import("../views/PageNotFoundView.vue")
}, { path: "*", redirect: "/page-not-found" }];

const router = new VueRouter({
  routes, scrollBehavior(to, from, savedPosition) {
    // return desired position
    if (to.name === "businessPage" || to.name === "product") return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  console.log(Vue.$keycloak);
  if (to?.meta?.requiresAuthentication) {
    if (!Vue.$keycloak.authenticated) {
      Vue.$keycloak.login({
        redirectUri: process.env.VUE_APP_URL + to.fullPath
      });
    } else {
      store.dispatch("userModule/tryCreateSocialUser");
      Vue.$keycloak.updateToken(3000).then(() => {
        next();
      });
    }
  } else {
    // Vue.$keycloak.login({
    //   prompt: "none",
    //   redirectUri: process.env.VUE_APP_URL + to.fullPath
    // });
    next();
  }
});

export default router;
