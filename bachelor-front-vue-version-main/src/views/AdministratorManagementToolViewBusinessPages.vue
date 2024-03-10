<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("businessPages") }}</h2>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.administratorManagementToolModule.businessPages.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <business-page-list-item
          v-for="businessPage in $store.state.administratorManagementToolModule.businessPages"
          :key="businessPage.id"
          :business-page="businessPage">
        </business-page-list-item>
      </div>
      <c-pagination
        v-if="$store.state.administratorManagementToolModule.businessPagesTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.administratorManagementToolModule.businessPagesTotalPages"
        :current-page="$store.state.administratorManagementToolModule.businessPagesCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import BusinessPageListItem from "@/components/administrator_management_tool_view/BusinessPageListItem";
import CPagination from "@/components/common/CPagination";

export default {
  name: "AdministratorManagementToolViewBusinessPages",
  components: {
    BusinessPageListItem,
    CPagination
  },
  created() {
    if (!this.$store.state.administratorManagementToolModule.businessPages.length) {
      this.fetchBusinessPagesLocal(1);
    }
  },
  methods: {
    handlePageChange(page) {
      this.fetchBusinessPagesLocal(page);
    },
    fetchBusinessPagesLocal(page) {
      this.$store.dispatch(
        "administratorManagementToolModule/fetchBusinessPages",
        page
      );
    }
  }
};
</script>

<style scoped>

</style>