<template>
  <div
    class="h-24 flex flex-shrink-0 border-b border-mid-gray border-solid justify-center"
  >
    <div class="container flex flex-shrink-0 items-center">
      <router-link to="/" v-if="isLimitedNavigationBar" class="mr-8">
        <font-awesome-icon
          size="xl"
          class="text-dark-blue"
          icon="fa-solid fa-arrow-left"
          :title="$t('goBack')"
        />
      </router-link>
      <font-awesome-icon
        data-cy="nav-side-bar-button"
        @click="isLeftSideBarShown = true"
        v-else
        size="xl"
        class="text-dark-blue mr-8 cursor-pointer"
        icon="fa-solid fa-bars"
        :title="$t('menu')"
      />
      <router-link to="/" :title="$t('frontPage')" data-cy="base-button">
        <img src="@/assets/images/logo.png" class="w-20" alt="">
<!--        <span-->
<!--          class="text-2xl font-bold text-dark-blue underline hover:no-underline"-->
<!--          >abobus</span-->
<!--        >-->
      </router-link
      >
      <div
        v-if="!isLimitedNavigationBar"
        class="hidden flex-row grow items-center sm:flex ml-8"
      >
        <div class="flex grow"></div>
        <div class="flex grow flex-col mr-7" style="max-width: calc(96px * 4)">
          <navigation-bar-search></navigation-bar-search>
        </div>
        <router-link to="/cart" class="mr-8" :title="$t('cart')" data-cy="cart-button">
          <font-awesome-icon
            :class="[
              isCurrentRoute('cart') ? 'text-dark-blue' : 'text-mid-gray',
            ]"
            class="hover:text-dark-blue"
            icon="fa-solid fa-cart-shopping"
          />
        </router-link>
        <router-link to="/favorites" class="mr-8" :title="$t('favorites')" data-cy="favorites-button">
          <font-awesome-icon
            :class="[
              isCurrentRoute('favorites') ? 'text-dark-blue' : 'text-mid-gray',
            ]"
            class="hover:text-dark-blue"
            icon="fa-solid fa-heart"
          />
        </router-link>
        <router-link
          data-cy="business-management-tool-button"
          v-if="isBusinessManagementToolShown()"
          to="/business-management-tool"
          :title="$t('businessManagementTool')"
        >
          <font-awesome-icon
            :class="[
              isCurrentRoute('businessManagementTool')
                ? 'text-dark-blue'
                : 'text-mid-gray',
            ]"
            class="hover:text-dark-blue mr-8"
            icon="fa-solid fa-briefcase"
          />
        </router-link>
        <router-link
          data-cy="administrator-management-tool-button"
          v-if="isAdministratorManagementToolShown()"
          to="/administrator-management-tool"
          :title="$t('administratorManagementTool')"
        >
          <font-awesome-icon
            :class="[
              isCurrentRoute('administratorManagementTool')
                ? 'text-dark-blue'
                : 'text-mid-gray',
            ]"
            class="hover:text-dark-blue mr-8"
            icon="fa-solid fa-solar-panel"
          />
        </router-link>
        <router-link to="/account" :title="$t('account')" data-cy="account-button">
          <font-awesome-icon
            :class="[
              isCurrentRoute('account') ? 'text-dark-blue' : 'text-mid-gray',
            ]"
            class="hover:text-dark-blue"
            icon="fa-solid fa-user"
          />
        </router-link>
      </div>
    </div>
    <navigation-bar-left-side-bar
      @closeClicked="isLeftSideBarShown = false"
      v-if="isLeftSideBarShown"
    ></navigation-bar-left-side-bar>
  </div>
</template>

<script>
import NavigationBarSearch from "@/components/navigation_bar/NavigationBarSearch";
import NavigationBarLeftSideBar from "@/components/navigation_bar/NavigationBarLeftSideBar";
import Vue from "vue";

export default {
  name: "NavigationBar",
  components: {
    NavigationBarSearch,
    NavigationBarLeftSideBar,
  },
  computed: {
    isLimitedNavigationBar() {
      return this.$route.meta.limitedNavigationBar;
    },
  },
  data() {
    return {
      isLeftSideBarShown: false,
      isRightSideBarShown: false,
    };
  },
  methods: {
    isCurrentRoute(routeName) {
      return this.$route.matched[0]?.name === routeName;
    },
    isBusinessManagementToolShown() {
      return Vue.$keycloak?.realmAccess?.roles?.includes("BUSINESS_OWNER");
    },
    isAdministratorManagementToolShown() {
      return Vue.$keycloak?.realmAccess?.roles?.includes("ADMIN");
    },
  },
};
</script>
