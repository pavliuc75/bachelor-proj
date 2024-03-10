<template>
  <div v-if="$store.state.productModule.product?.id === $route.params.productId"
       class="container flex flex-col sm:flex-row self-center gap-x-10 grow">
    <div class="flex basis-2/3 flex-col sm:grow sm:pr-10 sm:border-r sm:border-solid sm:border-mid-gray">
      <c-path-representation class="mt-3 min-h-[18px]" :directories="directories"></c-path-representation>
      <div
        :class="[!$store.state.productModule.product.additionalImages.length? 'grid-cols-1' : 'grid-cols-2', 'grid mt-[40px] sm:mt-16 gap-4 sm:gap-10 sm:pb-16']">
        <img
          :src="$store.state.productModule.product.mainImage.imageUrl"
          @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
          alt=""
          class="rounded-lg aspect-square w-full h-full object-cover"
        />
        <img v-for="(image) in $store.state.productModule.product.additionalImages" :key="image.imageKey"
             :src="image.imageUrl"
             @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
             alt=""
             class="rounded-lg aspect-square w-full h-full object-cover"
        />
      </div>
    </div>
    <div class="flex flex-col basis-1/3 leading-145 pb-10 sm:sticky sm:top-0 self-start">
      <span class="block font-bold mt-[40px] sm:mt-[94px]">{{ $store.state.productModule.product.name }}</span>
      <p class="text-cinder">{{ $store.state.productModule.product.description }}</p>
      <span class="block mt-2 font-bold text-[22px] leading-145">{{ formattedPrice }}</span>
      <div data-cy="open-product-side-bar-button" class="flex flex-row items-center justify-between mt-8 cursor-pointer reviews-wrapper" @click="isLeftSideBarShown = true">
        <div class="flex flex-col gap-2">
          <span class="block c-text-14 font-bold target-hover-heading">{{ $t("reviews") }}</span>
          <c-rating is-total-rating-shown
                    :value="$store.state.productModule.product.rating.overallRating || 0"
                    :total-ratings="$store.state.productModule.product.rating.totalRatings || 0"></c-rating>
        </div>
        <font-awesome-icon
          :title="$t('viewAllReviews')"
          class="text-mid-gray target-hover-icon"
          size="sm"
          icon="fa-solid fa-chevron-right"></font-awesome-icon>
      </div>
      <div class="border-b border-solid border-spun-pearl mt-4">
      </div>
      <router-link v-if="category" :title="$t('category')" :to="{name: 'base', query: {categories: category.id}}"
                   class="mt-10">
        <c-button-secondary icon-start="fa-solid fa-cubes" size="medium"
                            :text="$t(category.category.toLowerCase())"></c-button-secondary>
      </router-link>
      <div class="flex flex-row items-center mt-1" v-if="business">
        <span class="block c-text-14">{{ $t("soldBy") }}&nbsp;</span>
        <router-link :to="{name: 'businessPage', params: {businessPageId: business.id}}">
          <c-button-secondary size="medium" :text="business.businessDescription.legalName"></c-button-secondary>
        </router-link>
      </div>
      <div class="flex flex-row mt-6 items-center">
        <font-awesome-icon
          icon="fa-solid fa-warehouse"
          size="xs"
          class="mb-px"
        />
        <span class="block c-text-14 ml-2.5">{{ $store.state.productModule.product.stockAmount + " "
        + $tc("productsInStock", $store.state.productModule.product.stockAmount) }}</span>
      </div>
      <div class="flex flex-row items-center">
        <font-awesome-icon
          icon="fa-solid fa-hand-holding-dollar"
          size="xs"
          class="mb-px"
        />
        <span
          class="block c-text-14 ml-3">{{ ($store.state.productModule.product.totalSold || 0) + " " + $t("soldInTotal")
          }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 mt-12 flex-wrap">
        <c-button-secondary @click="handleProductCartActionLocal()" v-if="isProductInCartLocal" size="medium"
                            icon-end="fa-solid fa-xmark"
                            :text="$t('removeFromCart')"></c-button-secondary>
        <c-button-primary v-else data-cy="add-to-cart-button" @click="handleProductCartActionLocal()" size="medium"
                          icon-end="fa-solid fa-cart-shopping" :text="$t('addToCart')"></c-button-primary>
        <c-button-secondary @click="handleProductFavoritesActionLocal()" v-if="isProductInFavoritesLocal" size="medium"
                            icon-end="fa-solid fa-xmark"
                            :text="$t('removeFromFavorites')"></c-button-secondary>
        <c-button-secondary @click="handleProductFavoritesActionLocal()" v-else size="medium"
                            icon-end="fa-solid fa-heart" data-cy="add-to-favorites-button"
                            :text="$t('addToFavorites')"></c-button-secondary>
      </div>
    </div>
    <product-view-side-bar @closeClicked="isLeftSideBarShown = false"
                           v-if="isLeftSideBarShown">
    </product-view-side-bar>
  </div>
</template>

<script>
import CPathRepresentation from "@/components/common/CPathRepresentation";
import CRating from "@/components/common/CRating";
import CButtonPrimary from "@/components/common/CButtonPrimary";
import CButtonSecondary from "@/components/common/CButtonSecondary";
import { stringFormatter } from "@/util/stringFormatter";
import cartProductMixin from "@/components/cart_view/cartProductMixin";
import favoritesProductMixin from "@/components/favorites_view/favoritesProductMixin";
import ProductViewSideBar from "@/components/product_view/ProductViewSideBar.vue";
//todo: rating (mby hide if absent)

export default {
  name: "ProductView",
  components: {
    ProductViewSideBar,
    CPathRepresentation,
    CRating,
    CButtonPrimary,
    CButtonSecondary
  },
  mixins: [cartProductMixin, favoritesProductMixin],
  watch: {
    "$route.params.productId": {
      handler() {
        this.doOnCreate();
      }
    },
    "$store.state.cartModule.products"() {
      this.isProductInCartLocal = this.isProductInCart(this.$route.params.productId);
    },
    "$store.state.favoritesModule.favorites"() {
      this.isProductInFavoritesLocal = this.isProductInFavorites(this.$route.params.productId);
    }
  },
  computed: {
    directories() {
      if (this.$store.state.productModule.product?.id && this.category && this.business) {
        if (this.previousRouteName === "businessPage") {
          return [
            {
              name: this.$t("companies"),
              route: { name: "businessPages" }
            },
            {
              name: this.business?.businessDescription?.legalName,
              route: { name: "businessPage", params: { businessPageId: this.business.id } }
            },
            {
              name: this.$store.state.productModule.product?.name
            }
          ];
        } else if (this.previousRouteName === "cart") {
          return [
            {
              name: this.$t("cart"),
              route: { name: "cart" }
            },
            {
              name: this.$store.state.productModule.product?.name
            }
          ];
        } else {
          return [
            {
              name: this.$t("categories"),
              route: { name: "categories" }
            },
            {
              name: this.$t(this.category.category.toLowerCase()),
              route: { name: "base", query: { categories: this.category.id } }
            },
            {
              name: this.$store.state.productModule.product?.name
            }
          ];
        }
      }
      return [];
    },
    formattedPrice() {
      return stringFormatter.getFormattedPrice(this.$store.state.productModule.product?.price);
    },
    category() {
      return this.$store.state.productModule.categories.find(
        category => category.id === this.$store.state.productModule.product?.categoryId
      );
    },
    business() {
      return this.$store.state.businessModule.businessPages.find(
        business => business.id === this.$store.state.productModule.product?.belongsToBusinessId
      );
    }
  },
  created() {
    this.previousRouteName = sessionStorage.getItem("productViewPreviousRouteName");
    this.isProductInCartLocal = this.isProductInCart(this.$route.params.productId);
    this.isProductInFavoritesLocal = this.isProductInFavorites(this.$route.params.productId);
    this.doOnCreate();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name)
      sessionStorage.setItem("productViewPreviousRouteName", from.name);
    next();
  },
  data() {
    return {
      previousRouteName: null,
      isProductInCartLocal: false,
      isProductInFavoritesLocal: false,
      isLeftSideBarShown: false
    };
  },
  methods: {
    doOnCreate() {
      this.fetchCategoriesIfNecessary();
      if (this.$store.state.productModule.product?.id !== this.$route.params.productId) {
        let foundProductInProductStoreList = this.$store.state.productModule.products.find(
          product => product.id === this.$route.params.productId
        );
        if (foundProductInProductStoreList) {
          this.$store.commit("productModule/setProduct", foundProductInProductStoreList);
          this.fetchBusinessesIfNecessary();
          return;
        }
        let foundProductInSearchStoreList = this.$store.state.searchModule.products.find(
          product => product.id === this.$route.params.productId
        );
        if (foundProductInSearchStoreList) {
          this.$store.commit("productModule/setProduct", foundProductInSearchStoreList);
          this.fetchBusinessesIfNecessary();
          return;
        }
        this.$store.dispatch("productModule/fetchProduct", this.$route.params.productId)
          .then(() => this.fetchBusinessesIfNecessary());
      } else {
        this.fetchBusinessesIfNecessary();
      }
    },
    fetchCategoriesIfNecessary() {
      if (!this.$store.state.productModule.categories.length) {
        this.$store.dispatch("productModule/fetchCategories");
      }
    },
    fetchBusinessesIfNecessary() {
      if (!this.$store.state.businessModule.businessPages.find(business => business.id === this.$store.state.productModule.product.belongsToBusinessId)) {
        this.$store.dispatch("businessModule/fetchBusinessPages", 999);
      }
    },
    handleProductCartActionLocal() {
      this.isProductInCartLocal = !this.isProductInCartLocal;
      this.handleProductCartAction(this.$route.params.productId)
        ?.catch(() => {
          this.isProductInCartLocal = this.isProductInCart(this.$route.params.productId);
        });
    },

    handleProductFavoritesActionLocal() {
      this.isProductInFavoritesLocal = !this.isProductInFavoritesLocal;
      this.handleProductFavoriteAction(this.$route.params.productId)
        ?.catch(() => {
          this.isProductInFavoritesLocal = this.isProductInFavorites(this.$route.params.productId);
        });
    }
  }
};
</script>

<style scoped>
/deep/ .fa-cubes {
  font-size: 24px !important;
}

.reviews-wrapper:hover .target-hover-heading, .reviews-wrapper:hover .target-hover-icon {
  text-decoration: underline;
  color: var(--cinder) !important;
}
</style>