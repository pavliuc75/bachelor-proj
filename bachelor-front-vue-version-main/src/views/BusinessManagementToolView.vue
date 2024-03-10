<template>
  <div class="flex sm:flex-row flex-col h-full">
    <aside
      class="w-80 border-r border-solid border-mid-gray h-full sm:flex hidden flex-col px-20 py-16"
    >
      <c-info v-if="$store.state.businessManagementToolModule.business?.businessState === 'Blocked'" class="mb-3"
              type="error" size="sm" :text="$t('businessPageIsCurrentlyHiddenFromUsers')"></c-info>
      <h3 class="w-36">
        <span
          class="break-all">{{ this.$store.state.businessManagementToolModule.business?.businessDescription?.legalName || "..."
          }}</span>
        <span class="lowercase">{{ "\n" + $t("management") }}</span>
      </h3>
      <ul class="mt-10 flex flex-col gap-3">
        <li class="inline-flex">
          <router-link to="/business-management-tool/edit-business-page">
            <c-button-secondary
              :class="[
                isCurrentRoute('businessManagementToolEditBusinessPage')
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('editBusinessPage')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link to="/business-management-tool/products" data-cy="products-button">
            <c-button-secondary
              :class="[
                isCurrentRoute('businessManagementToolProducts')
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('products')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link to="/business-management-tool/orders">
            <c-button-secondary
              :class="[
                isCurrentRoute('businessManagementToolOrders')
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('orders')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link to="/business-management-tool/other" data-cy="other-button">
            <c-button-secondary
              :class="[
                isCurrentRoute('businessManagementToolOther')
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('other')"
            ></c-button-secondary>
          </router-link>
        </li>
      </ul>
    </aside>
    <nav class="sm:hidden sticky top-0">
      <div
        class="flex flex-row items-center justify-between bg-white py-3 px-4"
      >
        <div class="flex flex-col">
          <c-info v-if="$store.state.businessManagementToolModule.business?.businessState === 'Blocked'" class="mr-1"
                  type="error" size="sm" :text="$t('businessPageIsCurrentlyHiddenFromUsers')"></c-info>
          <h4>
          <span
            class="break-all">{{ this.$store.state.businessManagementToolModule.business?.businessDescription?.legalName || "..."
            }}</span>
            <span class="lowercase">{{ "\n" + $t("management") }}</span></h4>
        </div>
        <c-menu
          is-radio
          :items="[
            {
              name: $t('editBusinessPage'),
              selected: isCurrentRoute(
                'businessManagementToolEditBusinessPage'
              ), function: () => {
                this.$router.push(
                  '/business-management-tool/edit-business-page'
                );
              },
            },
            {
              name: $t('products'),
              selected: isCurrentRoute('businessManagementToolProducts'),
              function: () => {
                this.$router.push('/business-management-tool/products');
              },
            },
                        {
              name: $t('orders'),
              selected: isCurrentRoute('businessManagementToolOrders'),
              function: () => {
                this.$router.push('/business-management-tool/orders');
              },
            },
            {
              name: $t('other'),
              selected: isCurrentRoute('businessManagementToolOther'),
              function: () => {
                this.$router.push('/business-management-tool/other');
              },
            },
          ]"
        >
          <template #activator>
            <c-button-primary
              class="bg-white sticky"
              icon-start="fa-solid fa-bars"
              :text="$t('menu')"
            ></c-button-primary>
          </template>
        </c-menu>
      </div>
      <div class="border-b border-solid border-mid-gray"></div>
    </nav>
    <main class="flex flex-col grow py-16 sm:px-[40px] px-[16px]">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import CButtonPrimary from "@/components/common/CButtonPrimary";
import CMenu from "@/components/common/CMenu";
import CInfo from "@/components/common/CInfo";

export default {
  name: "BusinessManagementToolView",
  components: {
    CButtonSecondary,
    CButtonPrimary,
    CMenu,
    CInfo
  },
  created() {
    this.$store.dispatch("businessManagementToolModule/fetchCurrentUserBusinessData");
  },
  methods: {
    isCurrentRoute(route) {
      return this.$route.name === route;
    }
  }
};
</script>

<style scoped>
@media (min-width: 640px) {
  main {
    max-height: calc(100vh - 96px);
    overflow-y: auto;
  }
}
</style>
