<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <span class="c-text-14 truncate">{{ businessPage.businessDescription.legalName }}</span>
    <div class="flex items-center gap-x-3 flex-wrap">
      <c-button-secondary @click="isBusinessProductsDialogShown = true" :text="$t('products')"></c-button-secondary>
      <c-button-secondary @click="isBusinessOverviewDialogShown = true" :text="$t('overview')"></c-button-secondary>
    </div>
    <c-dialog width="736" v-model="isBusinessOverviewDialogShown">
      <template #title>
        <h3>{{ $t("businessOverview") }}</h3>
      </template>
      <template #body>
        <business-overview :business="businessPage"></business-overview>
      </template>
      <template #footer>
        <div class="mt-3 flex items-center justify-end">
          <c-button-secondary @click="isBusinessOverviewDialogShown = false" :text="$t('close')"></c-button-secondary>
        </div>
      </template>
    </c-dialog>
    <c-dialog width="736" v-model="isBusinessProductsDialogShown">
      <template #title>
        <h3 class="mb-8">{{ businessPage.businessDescription.legalName + " " + $t("products").toLowerCase() }}</h3>
      </template>
      <template #body>
        <div
          class="flex flex-col grow items-center justify-center"
          v-if="!products.length">
          <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
        </div>
        <div v-else class="flex flex-col">
          <div class="flex flex-col gap-y-3">
            <business-page-list-item-product-list-item
              @productDeleted="fetchProductsLocal(1)"
              v-for="product in products"
              :key="product.id"
              :product="product">
            </business-page-list-item-product-list-item>
          </div>
          <c-pagination
            v-if="productsTotalPages > 1"
            @currentPageChanged="handlePageChange"
            class="mt-8 self-center"
            :total-pages="productsTotalPages"
            :current-page="productsCurrentPage"
          ></c-pagination>
        </div>
      </template>
      <template #footer>
        <div class="mt-8 flex items-center justify-end">
          <c-button-secondary @click="isBusinessProductsDialogShown = false" :text="$t('close')"></c-button-secondary>
        </div>
      </template>
    </c-dialog>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import CDialog from "@/components/common/CDialog";
import BusinessOverview from "@/components/administrator_management_tool_view/BusinessOverview";
import CPagination from "@/components/common/CPagination";
import BusinessPageListItemProductListItem
  from "@/components/administrator_management_tool_view/BusinessPageListItemProductListItem";

export default {
  name: "BusinessPageListItem",
  components: {
    BusinessPageListItemProductListItem,
    CButtonSecondary,
    CDialog,
    BusinessOverview,
    CPagination
  },
  props: {
    businessPage: {
      type: Object,
      required: true
    }
  },
  watch: {
    isBusinessProductsDialogShown: {
      handler(newValue) {
        if (newValue) {
          if (!this.products.length) {
            this.fetchProductsLocal(1);
          }
        }
      }
    }
  },
  data() {
    return {
      isBusinessProductsDialogShown: false,
      isBusinessOverviewDialogShown: false,

      products: [],
      productsCurrentPage: 1,
      productsTotalPages: 1
    };
  },
  methods: {
    handlePageChange(page) {
      this.fetchProductsLocal(page);
    },
    fetchProductsLocal(page) {
      this.$store.dispatch("administratorManagementToolModule/fetchProducts", {
        page: page,
        businessId: this.businessPage.id
      }).then((response) => {
        this.products = response.productList;
        this.productsCurrentPage = page;
        this.productsTotalPages = response.totalAmountOfPages;
      }).catch(() => this.$store.dispatch("eventModule/showSnackbar", {
        message: this.$t("somethingWentWrong"),
        type: "error"
      }));
    }
  }
};
</script>

<style scoped>

</style>