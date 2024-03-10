<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("createCategoryRequests") }}</h2>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.administratorManagementToolModule.createCategoryRequests.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <create-category-request-list-item
          v-for="request in $store.state.administratorManagementToolModule.createCategoryRequests"
          :key="request.id"
          :category="request">
        </create-category-request-list-item>
      </div>
      <c-pagination
        v-if="$store.state.administratorManagementToolModule.createCategoryRequestsTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.administratorManagementToolModule.createCategoryRequestsTotalPages"
        :current-page="$store.state.administratorManagementToolModule.createCategoryRequestsCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import CPagination from "@/components/common/CPagination";
import CreateCategoryRequestListItem
  from "@/components/administrator_management_tool_view/CreateCategoryRequestListItem";

export default {
  name: "AdministratorManagementToolViewCreateCategoryRequests",
  components: {
    CPagination,
    CreateCategoryRequestListItem
  },
  created() {
    if (!this.$store.state.administratorManagementToolModule.createCategoryRequests.length) {
      this.fetchCreateCategoryRequestsLocal(1);
    }
  },
  methods: {
    handlePageChange(page) {
      this.fetchCreateCategoryRequestsLocal(page);
    },
    fetchCreateCategoryRequestsLocal(page) {
      this.$store.dispatch(
        "administratorManagementToolModule/fetchCreateCategoryRequests",
        page
      );
    }
  }
};
</script>

<style scoped>

</style>