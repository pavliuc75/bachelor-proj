<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <span class="c-text-14 truncate">{{ product.name }}</span>
    <div class="flex items-center gap-x-3 flex-wrap">
      <router-link target="_blank" :to="{name: 'product', params: {productId: product.id}}">
        <c-button-secondary :text="$t('view')"></c-button-secondary>
      </router-link>
      <c-button-secondary @click="isDeleteProductDialogShown = true" :text="$t('delete')"></c-button-secondary>
      <c-dialog :title-text="$t('deleteProduct')" :subtitle-text="$t('doYouReallyWantToDelete', {name: product.name})"
                v-model="isDeleteProductDialogShown" @confirm="handleConfirmDeleteProduct()"></c-dialog>
    </div>
  </div>
</template>

<script>
import CDialog from "@/components/common/CDialog";
import CButtonSecondary from "@/components/common/CButtonSecondary";

export default {
  name: "BusinessPageListItemProductListItem",
  components: {
    CButtonSecondary,
    CDialog
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDeleteProductDialogShown: false
    };
  },
  methods: {
    handleConfirmDeleteProduct() {
      this.$store.dispatch("administratorManagementToolModule/deleteProduct", this.product.id)
        .then(() => {
          this.$emit("productDeleted");
          this.isDeleteProductDialogShown = false;
        })
        .catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$t("somethingWentWrong"),
            type: "error"
          });
        });
    }
  }
};
</script>

<style scoped>

</style>