<template>
  <div class="flex sm:flex-row flex-col h-full">
    <aside
      class="w-80 border-r border-solid border-mid-gray h-full sm:flex hidden flex-col px-20 py-16"
    >
      <h3 class="w-36">{{ $t("administratorManagementTool") }}</h3>
      <ul class="mt-10 flex flex-col gap-3">
        <li class="inline-flex">
          <router-link
            to="/administrator-management-tool/create-business-page-requests"
          >
            <c-button-secondary
              :class="[
                isCurrentRoute(
                  'administratorManagementToolCreateBusinessPageRequests'
                )
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              class="text-left"
              size="medium"
              :text="$t('createBusinessPageRequests')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link
            to="/administrator-management-tool/business-pages"
          >
            <c-button-secondary
              :class="[
                isCurrentRoute(
                  'administratorManagementToolBusinessPages'
                )
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('businessPages')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link
            to="/administrator-management-tool/create-category-requests"
          >
            <c-button-secondary
              :class="[
                isCurrentRoute(
                  'administratorManagementToolCreateCategoryRequests'
                )
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('createCategoryRequests')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link
            to="/administrator-management-tool/categories"
          >
            <c-button-secondary
              :class="[
                isCurrentRoute(
                  'administratorManagementToolCategories'
                )
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('categories')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link
            to="/administrator-management-tool/orders"
          >
            <c-button-secondary
              :class="[
                isCurrentRoute(
                  'administratorManagementToolOrders'
                )
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
          <router-link to="/administrator-management-tool/support-discussions">
            <c-button-secondary
              :class="[
                isCurrentRoute('administratorManagementToolSupportDiscussions')
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('supportDiscussions')"
            ></c-button-secondary>
          </router-link>
        </li>
        <li class="inline-flex">
          <router-link
            data-cy="stats-button"
            to="/administrator-management-tool/stats"
          >
            <c-button-secondary
              :class="[
                isCurrentRoute(
                  'administratorManagementToolStats'
                )
                  ? 'text-dark-blue no-underline'
                  : '',
              ]"
              size="medium"
              class="text-left"
              :text="$t('stats')"
            ></c-button-secondary>
          </router-link>
        </li>
      </ul>
    </aside>
    <nav class="sm:hidden sticky top-0">
      <div
        class="flex flex-row items-center justify-between bg-white py-3 px-4"
      >
        <h4>{{ $t("administratorManagementTool") }}</h4>
        <c-menu
          is-radio
          :items="[
            {
              name: $t('createBusinessPageRequests'),
              selected: isCurrentRoute(
                'administratorManagementToolCreateBusinessPageRequests'
              ),
              function: () => {
                this.$router.push(
                  '/administrator-management-tool/create-business-page-requests'
                );
              },
            },
            {
              name: $t('businessPages'),
              selected: isCurrentRoute(
                'administratorManagementToolBusinessPages'
              ),
              function: () => {
                this.$router.push(
                  '/administrator-management-tool/business-pages'
                );
              },
            },
                        {
              name: $t('createCategoryRequests'),
              selected: isCurrentRoute(
                'administratorManagementToolCreateCategoryRequests'
              ),
              function: () => {
                this.$router.push(
                  '/administrator-management-tool/create-category-requests'
                );
              },
            },
            {
              name: $t('categories'),
              selected: isCurrentRoute(
                'administratorManagementToolCategories'
              ),
              function: () => {
                this.$router.push(
                  '/administrator-management-tool/categories'
                );
              },
            },
            {
              name: $t('orders'),
              selected: isCurrentRoute(
                'administratorManagementToolOrders'
              ),
              function: () => {
                this.$router.push(
                  '/administrator-management-tool/orders'
                );
              },
            },
            {
              name: $t('supportDiscussions'),
              selected: isCurrentRoute(
                'administratorManagementToolSupportDiscussions'
              ),
              function: () => {
                this.$router.push('/administrator-management-tool/support-discussions');
              },
            },
            {
              name: $t('stats'),
              selected: isCurrentRoute(
                'administratorManagementToolStats'
              ),
              function: () => {
                this.$router.push(
                  '/administrator-management-tool/stats'
                );
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

export default {
  name: "AdministratorManagementToolView",
  components: {
    CButtonSecondary,
    CButtonPrimary,
    CMenu
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
