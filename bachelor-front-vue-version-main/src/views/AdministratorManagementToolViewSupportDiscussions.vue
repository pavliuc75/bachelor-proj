<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("supportDiscussions") }}</h2>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.administratorManagementToolModule.threads.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <support-discussion-list-item
          v-for="discussion in $store.state.administratorManagementToolModule.threads"
          :key="discussion.id"
          :discussion="discussion">
        </support-discussion-list-item>
      </div>
      <c-pagination
        v-if="$store.state.administratorManagementToolModule.threadsTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.administratorManagementToolModule.threadsTotalPages"
        :current-page="$store.state.administratorManagementToolModule.threadsCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import CPagination from "@/components/common/CPagination.vue";
import SupportDiscussionListItem from "@/components/administrator_management_tool_view/SupportDiscussionListItem.vue";

export default {
  name: "AdministratorManagementToolViewSupportDiscussions",
  components: {
    CPagination,
    SupportDiscussionListItem
  },
  created() {
    if (!this.$store.state.administratorManagementToolModule.threads.length) {
      this.fetchThreadsLocal(1);
    }
  },
  methods: {
    handlePageChange(page) {
      this.fetchThreadsLocal(page);
    },
    fetchThreadsLocal(page) {
      this.$store.dispatch(
        "administratorManagementToolModule/fetchThreads",
        page
      );
    }
  }
};
</script>

<style scoped>

</style>