<template>
  <div class="flex flex-col grow" v-if="!loading">
    <div v-if="isToolbarShown" class="flex flex-col sticky top-0 bg-white">
      <div class="flex flex-row container self-center justify-between flex-wrap">
        <slot name="pathRepresentation"></slot>
        <div class="flex flex-row gap-x-2.5 my-5 flex-wrap">
          <div class="inline-block">
            <c-menu
              attach
              is-radio
              :items="stockOptions"
            >
              <template #activator>
                <c-button-primary
                  data-cy="stock-filter-menu"
                  type="button"
                  :text="$t('stock')"
                  :icon-start="selectedStock === false ? 'fa-solid fa-circle': ''"
                  icon-end="fa-solid fa-chevron-down"
                ></c-button-primary>
              </template>
            </c-menu>
          </div>
          <div class="inline-block" v-if="this.$store.state.productModule.categories.length">
            <c-menu
              attach
              is-checkbox
              :items="categories"
            >
              <template #activator>
                <c-button-primary
                  data-cy="category-filter-menu"
                  type="button"
                  :text="$t('category')"
                  :icon-start="selectedCategories.length ? 'fa-solid fa-circle': ''"
                  icon-end="fa-solid fa-chevron-down"
                ></c-button-primary>
              </template>
            </c-menu>
          </div>
          <div class="inline-block">
            <c-menu
              attach
              is-radio
              :items="sortingOptions"
            >
              <template #activator>
                <c-button-primary
                  type="button"
                  :text="$t('sort')"
                  :icon-start="selectedSorting !== '' ? 'fa-solid fa-circle': ''"
                  icon-end="fa-solid fa-chevron-down"
                ></c-button-primary>
              </template>
            </c-menu>
          </div>
        </div>
      </div>
      <div class="border-b border-mid-gray border-solid"></div>
    </div>
    <div v-if="(selectedCategories.length || !selectedStock) && isToolbarShown" class="container self-center mt-5 gap-2.5 flex flex-row flex-wrap">
      <c-button-secondary v-for="(category, index) in formattedSelectedCategories" :key="index"
                          data-cy="remove-category-filter-button"
                          type="button" @click="removeCategory(category)"
                          icon-start="fa-solid fa-remove" :text="$t(category.category)"></c-button-secondary>
      <c-button-secondary data-cy="remove-out-of-stock-button" v-if="!selectedStock" type="button" @click="$emit('stockSelected', true)"
                          icon-start="fa-solid fa-remove" :text="$t('outOfStock')"></c-button-secondary>
    </div>
    <div class="flex flex-col" v-if="products.length">
      <products-shelf v-for="index in [...Array(Math.ceil(products.length/productsPerShelf)).keys()]"
                      :key="index"
                      :products-per-shelf="productsPerShelf"
                      :products="products.slice(index * productsPerShelf, (index + 1) * productsPerShelf)"></products-shelf>
      <div class="flex flex-col items-center pt-10">
        <span v-if="productsInTotal !== -1" class="c-text-12 mb-4">{{ $t("showingOutOf", { amount: products.length, total: productsInTotal })
          }}</span>
        <span v-else class="c-text-12 mb-4">...</span>
        <c-button-primary
          v-if="products.length < productsInTotal"
          type="button"
          @click="$emit('loadMore')"
          :text="$t('loadMore')"
        ></c-button-primary>
      </div>
    </div>
    <div v-else class="flex flex-col grow min-h-[144px] items-center justify-center">
      <h4 v-if="!loading" class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
  </div>
</template>

<script>
import CMenu from "@/components/common/CMenu";
import CButtonPrimary from "@/components/common/CButtonPrimary";
import ProductsShelf from "@/components/products_grid/ProductsShelf";
import _debounce from "lodash/debounce";
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";

export default {
  name: "ProductsGrid",
  components: {
    CButtonSecondary,
    CMenu,
    CButtonPrimary,
    ProductsShelf
  },
  props: {
    products: {
      type: Array,
      required: true
    },
    productsInTotal: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean
    },
    selectedSorting: {
      type: String,
      default: ""
    },
    selectedStock: {
      type: Boolean,
      default: true
    },
    selectedCategories: {
      type: Array,
      default: () => []
    },
    isToolbarShown: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    categories() {
      return this.$store.state.productModule.categories.map(category => {
        return {
          name: this.$t(category.category),
          selected: this.selectedCategories.includes(category.id),
          function: () => {
            if (this.selectedCategories.includes(category.id)) {
              let selectedCategoriesCopy = [...this.selectedCategories];
              selectedCategoriesCopy.splice(selectedCategoriesCopy.indexOf(category.id), 1);
              this.$emit("categorySelected", selectedCategoriesCopy);
            } else {
              this.$emit("categorySelected", [...this.selectedCategories, category.id]);
            }
          }
        };
      });
    },
    formattedSelectedCategories() {
      return this.$store.state.productModule.categories.filter(category => this.selectedCategories.includes(category.id));
    },
    stockOptions() {
      return [
        {
          name: this.$t("inStock"),
          value: true,
          selected: true === this.selectedStock,
          function: () => this.$emit("stockSelected", true)
        },
        {
          name: this.$t("outOfStock"),
          value: false,
          selected: false === this.selectedStock,
          function: () => this.$emit("stockSelected", false)
        }
      ];
    },
    sortingOptions() {
      let sortingOptions = [
        {
          text: this.$t("bestMatch"),
          value: ""
        },
        {
          text: this.$t("lowestPrice"),
          value: "PRICE_ASC"
        },
        {
          text: this.$t("highestPrice"),
          value: "PRICE_DSC"
        },
        {
          text: this.$t("nameAZ"),
          value: "NAME_ASC"
        },
        {
          text: this.$t("nameZA"),
          value: "NAME_DSC"
        },
        {
          text: this.$t("leastSold"),
          value: "TOTAL_SOLD_ASC"
        },
        {
          text: this.$t("mostSold"),
          value: "TOTAL_SOLD_DSC"
        },
        {
          text: this.$t("worstRating"),
          value: "RATING_ASC"
        },
        {
          text: this.$t("bestRating"),
          value: "RATING_DSC"
        }
      ];
      return sortingOptions.map((option) => {
        return {
          name: option.text,
          selected: option.value === this.selectedSorting,
          function: () => this.$emit("sortingSelected", option.value)
        };
      });
    },
    productsPerShelf() {
      if (this.screenInnerWidth < 414) {
        return 1;
      } else if (this.screenInnerWidth < 764) {
        return 2;
      } else if (this.screenInnerWidth < 1280) {
        return 3;
      } else {
        return 4;
      }
    }
  },
  created() {
    this.setScreenInnerWidth();
    window.addEventListener("resize", this.setScreenInnerWidthWithDebounce);

    if (!this.$store.state.productModule.categories.length) {
      this.$store.dispatch("productModule/fetchCategories");
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setScreenInnerWidthWithDebounce);
  },
  data() {
    return {
      screenInnerWidth: 0
    };
  },
  methods: {
    setScreenInnerWidth() {
      this.screenInnerWidth = window.innerWidth;
    },
    setScreenInnerWidthWithDebounce: _debounce(function() {
      this.setScreenInnerWidth();
    }, 10),
    removeCategory(category) {
      let selectedCategoriesCopy = [...this.selectedCategories];
      selectedCategoriesCopy.splice(selectedCategoriesCopy.indexOf(category.id), 1);
      this.$emit("categorySelected", selectedCategoriesCopy);
    }
  }
};
</script>

<style scoped>
/deep/ .fa-circle {
  font-size: 3px !important;
}
</style>