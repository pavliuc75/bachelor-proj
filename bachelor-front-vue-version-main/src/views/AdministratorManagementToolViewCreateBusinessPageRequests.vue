<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("createBusinessPageRequests") }}</h2>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="
        !$store.state.administratorManagementToolModule
          .createBusinessPageRequests.length
      "
    >
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <create-business-page-request-list-item
          v-for="request in $store.state.administratorManagementToolModule
            .createBusinessPageRequests"
          :key="request.id"
          :request="request">
        </create-business-page-request-list-item>
      </div>
      <c-pagination
        v-if="$store.state.administratorManagementToolModule
          .createBusinessPageRequestsTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.administratorManagementToolModule
          .createBusinessPageRequestsTotalPages"
        :current-page="$store.state.administratorManagementToolModule
          .createBusinessPageRequestsCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import CPagination from "@/components/common/CPagination";
import CreateBusinessPageRequestListItem from "@/components/administrator_management_tool_view/CreateBusinessPageRequestListItem";

export default {
  name: "AdministratorManagementToolViewCreateBusinessPageRequests",
  components: {
    CPagination,
    CreateBusinessPageRequestListItem
  },
  created() {
    if (!this.$store.state.administratorManagementToolModule.createBusinessPageRequests.length) {
      this.fetchCreateBusinessPageRequestsLocal(1);
    }
  },
  methods: {
    handlePageChange(page) {
      this.fetchCreateBusinessPageRequestsLocal(page);
    },
    fetchCreateBusinessPageRequestsLocal(page) {
      this.$store.dispatch(
        "administratorManagementToolModule/fetchCreateBusinessPageRequests",
        page
      );
    }
  }
};
</script>

<style scoped></style>
