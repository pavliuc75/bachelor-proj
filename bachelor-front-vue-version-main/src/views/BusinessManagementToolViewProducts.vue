<template>
  <div class="flex flex-col grow">
    <h2>{{ $t("products") }}</h2>
    <div class="flex flex-row justify-end mb-2">
      <c-button-primary @click="isProductCreateDialogShown = true" icon-start="fa-solid fa-plus"
                        :text="$t('addProduct')"></c-button-primary>
      <c-dialog v-model="isProductCreateDialogShown">
        <template #title>
          <h3>{{ $t("addProduct") }}</h3>
        </template>
        <template #body>
          <edit-product @close="isProductCreateDialogShown = false" class="mt-8"></edit-product>
        </template>
        <template #footer>
          <div></div>
        </template>
      </c-dialog>
    </div>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.businessManagementToolModule.products.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <product-list-item
          v-for="product in $store.state.businessManagementToolModule.products"
          :key="product.id"
          :product="product">
        </product-list-item>
      </div>
      <c-pagination
        v-if="$store.state.businessManagementToolModule.productsTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.businessManagementToolModule.productsTotalPages"
        :current-page="$store.state.businessManagementToolModule.productsCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import CPagination from "@/components/common/CPagination";
import ProductListItem from "@/components/business_management_tool_view/ProductListItem";
import CButtonPrimary from "@/components/common/CButtonPrimary";
import CDialog from "@/components/common/CDialog";
import EditProduct from "@/components/business_management_tool_view/EditProduct";

export default {
  name: "AdministratorManagementToolViewProducts",
  components: {
    CPagination,
    ProductListItem,
    CButtonPrimary,
    CDialog,
    EditProduct
  },
  created() {
    if (!this.$store.state.businessManagementToolModule.products.length) {
      if (!this.$store.state.businessManagementToolModule.business?.id) {
        this.$store.dispatch("businessManagementToolModule/fetchCurrentUserBusinessData")
          .then(() => {
            this.fetchProductsLocal(1);
          });

      } else {
        this.fetchProductsLocal(1);
      }
    }
  },
  data() {
    return {
      isProductCreateDialogShown: false
    };
  },
  methods: {
    handlePageChange(page) {
      this.fetchProductsLocal(page);
    },
    fetchProductsLocal(page) {
      this.$store.dispatch(
        "businessManagementToolModule/fetchProducts", page
      );
    },
  }
};
</script>

<style scoped></style>
