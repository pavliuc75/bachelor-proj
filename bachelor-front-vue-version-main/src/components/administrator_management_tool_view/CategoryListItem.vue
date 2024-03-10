<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <span class="c-text-14 truncate">{{ $t(category.category.toLowerCase()) }}</span>
    <div class="flex items-center gap-x-3 flex-wrap">
      <router-link target="_blank" :to="{name: 'base', query: {categories: category.id}}">
        <c-button-secondary
          :text="$t('viewProducts')"
        ></c-button-secondary>
      </router-link>
      <c-button-secondary @click="isDeleteCategoryDialogShown = true" :text="$t('delete')"></c-button-secondary>
    </div>
    <c-dialog :title-text="$t('deleteCategory')"
              :subtitle-text="$t('doYouReallyWantToDelete', {name: $t(category.category.toLowerCase())})"
              v-model="isDeleteCategoryDialogShown" @confirm="handleConfirmDeleteCategory()"></c-dialog>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import CDialog from "@/components/common/CDialog";

export default {
  name: "CategoryListItem",
  components: {
    CButtonSecondary,
    CDialog
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDeleteCategoryDialogShown: false
    };
  },
  methods: {
    handleConfirmDeleteCategory() {
      this.$store.dispatch("administratorManagementToolModule/deleteCategory", this.category.id)
        .then(() => {
          this.isDeleteCategoryDialogShown = false;
          this.$store.dispatch("administratorManagementToolModule/fetchCategories", 1);
        })
        .catch(() =>
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$t("somethingWentWrong"),
            type: "error"
          }));
    }
  }
};
</script>

<style scoped>

</style>