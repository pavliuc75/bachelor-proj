<template>
  <div class="flex flex-col grow mb-16">
    <products-grid
      :loading="$store.state.productModule.isProductsLoading"
      @sortingSelected="(e) => updateQuery('sorting', e)"
      @stockSelected="(e) => updateQuery('inStock', e)"
      @categorySelected="(e) => updateQuery('categories', e)"
      :selected-sorting="$route.query.sorting || ''"
      :selected-stock="$route.query.inStock !== 'false'"
      :selected-categories="selectedCategoriesProp"
      @loadMore="handleLoadMoreButtonClicked()"
      :products="$store.state.productModule.products"
      :products-in-total="$store.state.productModule.totalProductsOnServer">
      <template #pathRepresentation>
        <c-path-representation v-if="$store.state.productModule.categories.length" class="self-start mt-3"
                               :directories="[
          {
            route: { path: '/categories' },
            name: $t('categories'),
          },
          { name: currentCategory },
        ]"
        ></c-path-representation>
      </template>
    </products-grid>
  </div>
</template>

<script>
import ProductsGrid from "@/components/products_grid/ProductsGrid";
import CPathRepresentation from "@/components/common/CPathRepresentation.vue";

export default {
  name: "BaseView",
  components: {
    ProductsGrid,
    CPathRepresentation
  },
  watch: {
    "$route.query"() {
      this.$store.dispatch("productModule/fetchProducts", {
        sorting: this.$route.query.sorting || undefined,
        filtering: {
          category: this.selectedCategoriesProp.length ? this.selectedCategoriesProp : undefined,
          inStock: this.$route.query.inStock !== "false"
        },
        isWithPaginationReset: true
      });
    }
  },
  computed: {
    currentCategory() {
      if (this.selectedCategoriesProp.length === 0) {
        return this.$t("allProducts");
      } else if (this.selectedCategoriesProp.length === 1) {
        let result = this.$store.state.productModule.categories.find((category) => category.id === this.selectedCategoriesProp[0]).category;
        if (result) {
          return this.$t(result.toLowerCase());
        }
      }
      return "";
    },
    selectedCategoriesProp() {
      if (this.$route.query.categories) {
        if (Array.isArray(this.$route.query.categories))
          return this.$route.query.categories;
        return [this.$route.query.categories];
      }
      return [];
    },
    areAnyFiltersSet() {
      return !!this.selectedCategoriesProp.length || this.$route.query.inStock === "false";
    }
  },
  created() {
    if ((JSON.stringify(this.$store.state.productModule.baseViewLatestRouteQuery) !== JSON.stringify(this.$route.query)
      || !this.$store.state.productModule.products.length)) {
      this.$store.dispatch("productModule/fetchProducts", {
        sorting: this.$route.query.sorting || undefined,
        filtering: {
          category: this.selectedCategoriesProp.length ? this.selectedCategoriesProp : undefined,
          inStock: this.$route.query.inStock !== "false"
        },
        isWithPaginationReset: true,
        isFirstLoad: true
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("productModule/setBaseViewLatestRouteQuery", from.query);
    next();
  },
  methods: {
    updateQuery(name, item) {
      this.$router.push({
        query: {
          ...this.$route.query,
          [name]: item
        }
      });
    },
    handleLoadMoreButtonClicked() {
      this.$store.dispatch("productModule/fetchProducts", {
        sorting: this.$route.query.sorting || undefined,
        filtering: {
          category: this.selectedCategoriesProp.length ? this.selectedCategoriesProp : undefined,
          inStock: this.$route.query.inStock !== "false"
        },
        isWithPaginationReset: false
      });
    }
  }
};
</script>
