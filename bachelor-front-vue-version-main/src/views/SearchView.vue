<template>
  <div class="flex flex-col grow my-16">
    <div
      :class="{'max-w-3xl' : !$store.state.searchModule.businessPages.length && !($store.state.searchModule.products.length || areAnyFiltersSet) ||
                              $store.state.searchModule.businessPages.length && ($store.state.searchModule.products.length || areAnyFiltersSet) ||
                              $store.state.searchModule.businessPages.length && !($store.state.searchModule.products.length || areAnyFiltersSet)} "
      class="container flex self-center flex-col mb-20">
      <h1>{{ $t("searchResultsFor") + " '" }}<span class="font-normal">{{ searchQuery }}</span>'</h1>
    </div>
    <div v-if="$store.state.searchModule.businessPages.length"
         class="container flex self-center flex-col max-w-3xl mb-20">
      <h3 class="mb-10">{{ $t("companies") }}</h3>
      <ul class="ml-8 flex flex-col gap-3">
        <li v-for="businessPage in $store.state.searchModule.businessPages" :key="businessPage.id" class="self-start">
          <router-link :to="{name: 'businessPage', params: {businessPageId: businessPage.id}}">
            <c-button-secondary
              size="medium"
              :text="businessPage.businessDescription.legalName"
            ></c-button-secondary>
          </router-link>
        </li>
        <c-button-primary
          v-if="isLoadMoreShown"
          class="self-start mt-5"
          @click="$store.dispatch('searchModule/fetchBusinessPages', {keyword: $route.query.keyword || '',})"
          :text="$t('loadMore')">
        </c-button-primary>
      </ul>
    </div>
    <div v-if="$store.state.searchModule.products.length || areAnyFiltersSet"
         :class="{'max-w-3xl' : $store.state.searchModule.businessPages.length}"
         class="container flex self-center flex-col mb-8">
      <h3>{{ $t("products") }}</h3>
    </div>
    <div v-if="$store.state.searchModule.products.length || areAnyFiltersSet"
         class="flex flex-col grow">
      <div class="border-b border-solid border-mid-gray"></div>
      <products-grid
        @sortingSelected="(e) => updateQuery('sorting', e)"
        @stockSelected="(e) => updateQuery('inStock', e)"
        @categorySelected="(e) => updateQuery('categories', e)"
        :selected-sorting="$route.query.sorting || ''"
        :selected-stock="$route.query.inStock !== 'false'"
        :selected-categories="selectedCategoriesProp"
        @loadMore="handleLoadMoreButtonClicked()"
        :products="$store.state.searchModule.products"
        :products-in-total="$store.state.searchModule.totalProductsOnServer">
        <template #pathRepresentation>
          <div></div>
        </template>
      </products-grid>
    </div>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import ProductsGrid from "@/components/products_grid/ProductsGrid.vue";

//todo filer and [] EMPTY

export default {
  name: "SearchView",
  components: {
    CButtonSecondary,
    CButtonPrimary,
    ProductsGrid
  },
  watch: {
    "$route.query"(newValue, oldValue) {
      if (newValue.keyword !== oldValue.keyword) {
        this.$store.dispatch("searchModule/fetchBusinessPages", {
          keyword: this.$route.query.keyword || "",
          isWithPaginationReset: true
        });
      }

      this.$store.dispatch("searchModule/fetchProducts", {
        keyword: this.$route.query.keyword || "",
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
    selectedCategoriesProp() {
      if (this.$route.query.categories) {
        if (Array.isArray(this.$route.query.categories))
          return this.$route.query.categories;
        return [this.$route.query.categories];
      }
      return [];
    },
    searchQuery() {
      return this.$route.query.keyword;
    },
    isLoadMoreShown() {
      return this.$store.state.searchModule.totalBusinessPagesPagesOnServer > this.$store.state.searchModule.businessPagesCurrentPage + 1;
    },
    areAnyFiltersSet() {
      return !!this.selectedCategoriesProp.length || this.$route.query.inStock === "false";
    }
  },
  created() {
    this.$store.dispatch("searchModule/fetchBusinessPages", {
      keyword: this.$route.query.keyword || "",
      isWithPaginationReset: true
    });

    this.$store.dispatch("searchModule/fetchProducts", {
      keyword: this.$route.query.keyword || "",
      sorting: this.$route.query.sorting || undefined,
      filtering: {
        category: this.selectedCategoriesProp.length ? this.selectedCategoriesProp : undefined,
        inStock: this.$route.query.inStock !== "false"
      },
      isWithPaginationReset: true
    });
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
      this.$store.dispatch("searchModule/fetchProducts", {
        keyword: this.$route.query.keyword || "",
        sorting: this.$route.query.sorting || undefined,
        filtering: {
          category: this.selectedCategoriesProp.length ? this.selectedCategoriesProp : undefined,
          inStock: this.$route.query.inStock !== "false"
        }
      });
    }
  }
};
</script>

<style scoped>

</style>