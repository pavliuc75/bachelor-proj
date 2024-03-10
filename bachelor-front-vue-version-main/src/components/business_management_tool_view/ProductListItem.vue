<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <span class="c-text-14 truncate">{{ product.name }}</span>
    <div class="flex items-center gap-x-3 flex-wrap">
      <router-link target="_blank" :to="{name: 'product', params: {productId: product.id}}">
        <c-button-secondary :text="$t('view')"></c-button-secondary>
      </router-link>
      <c-button-secondary data-cy="edit-product-button" @click="isProductEditDialogShown = true" :text="$t('edit')"></c-button-secondary>
      <c-button-secondary data-cy="delete-product-button" @click="isProductDeleteDialogShown = true" :text="$t('delete')"></c-button-secondary>
    </div>
    <c-dialog v-model="isProductEditDialogShown">
      <template #title>
        <h3>{{ $t("editProduct") }}</h3>
      </template>
      <template #body>
        <edit-product :product="product" @close="isProductEditDialogShown = false" class="mt-8"></edit-product>
      </template>
      <template #footer>
        <div></div>
      </template>
    </c-dialog>
    <c-dialog :title-text="$t('deleteProduct')" :subtitle-text="$t('doYouReallyWantToDelete', {name: product.name})"
              v-model="isProductDeleteDialogShown" @confirm="handleConfirmDeleteProduct()"></c-dialog>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import CDialog from "@/components/common/CDialog";
import EditProduct from "@/components/business_management_tool_view/EditProduct";

export default {
  name: "ProductListItem",
  components: {
    CButtonSecondary,
    CDialog,
    EditProduct
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isProductEditDialogShown: false,
      isProductDeleteDialogShown: false
    };
  },
  methods: {
    handleConfirmDeleteProduct() {
      this.$store.dispatch("businessManagementToolModule/deleteProduct", this.product.id)
        .then(() => {
          this.isProductDeleteDialogShown = false;
          this.$store.dispatch("businessManagementToolModule/fetchProducts", 1);
        })
        .catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$t("somethingWentWrong"),
            type: "error"
          });
        });
    },
  }
};
</script>

<style scoped>

</style>