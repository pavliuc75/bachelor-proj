<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("categories") }}</h2>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.administratorManagementToolModule.categories.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <category-list-item
          v-for="category in $store.state.administratorManagementToolModule.categories"
          :key="category.id"
          :category="category">
        </category-list-item>
      </div>
      <c-pagination
        v-if="$store.state.administratorManagementToolModule.categoriesTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.administratorManagementToolModule.categoriesTotalPages"
        :current-page="$store.state.administratorManagementToolModule.categoriesCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import CPagination from "@/components/common/CPagination";
import CategoryListItem from "@/components/administrator_management_tool_view/CategoryListItem";

export default {
  name: "AdministratorManagementToolViewCategories",
  components: {
    CPagination,
    CategoryListItem
  },
  created() {
    if (!this.$store.state.administratorManagementToolModule.categories.length) {
      this.fetchCategoriesLocal(1);
    }
  },
  methods: {
    handlePageChange(page) {
      this.fetchCategoriesLocal(page);
    },
    fetchCategoriesLocal(page) {
      this.$store.dispatch(
        "administratorManagementToolModule/fetchCategories",
        page
      );
    }
  }
};
</script>

<style scoped>

</style>