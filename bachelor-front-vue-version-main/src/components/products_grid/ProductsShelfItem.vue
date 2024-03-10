<template>
  <div class="wrapper">
    <router-link :to="{name: 'product', params: {productId: product.id}}" data-cy="product-card">
      <img
        :src="product.mainImage.imageUrl"
        @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
        alt=""
        class="rounded-lg aspect-square w-full object-cover mb-8"
      />
    </router-link>
    <div class="flex flex-row justify-space-between items-center">
      <router-link :to="{name: 'product', params: {productId: product.id}}"
                   class="block c-text-14 font-bold cursor-default truncate mr-2" :title="product.name">{{ product.name
        }}
      </router-link>
      <div class="flex flex-row gap-x-3">
        <font-awesome-icon
          @click="handleProductCartActionLocal()"
          :class="[isProductInCartLocal ? 'text-dark-blue' : 'text-mid-gray']"
          :title="isProductInCartLocal ? $t('removeFromCart') :$t('addToCart')"
          icon="fa-solid fa-cart-shopping"
          size="sm"
        />
        <font-awesome-icon
          @click="handleProductFavoriteActionLocal()"
          :class="[isProductInFavoritesLocal ? 'text-dark-blue' : 'text-mid-gray']"
          :title="isProductInFavoritesLocal ? $t('removeFromFavorites') :$t('addToFavorites')"
          icon="fa-solid fa-heart"
          size="sm"
        />
      </div>
    </div>
    <router-link :to="{name: 'product', params: {productId: product.id}}">
      <p class="text-cinder" :title="product.description">{{ product.description }}</p>
    </router-link>
    <span class="block mt-2 font-bold text-[22px] leading-145">{{ formattedPrice }}</span>
  </div>
</template>

<script>

import { stringFormatter } from "@/util/stringFormatter";
import cartProductMixin from "@/components/cart_view/cartProductMixin";
import favoritesProductMixin from "@/components/favorites_view/favoritesProductMixin";

export default {
  name: "ProductsShelfItem",
  mixins: [cartProductMixin, favoritesProductMixin],
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  watch: {
    "$store.state.cartModule.products"() {
      this.isProductInCartLocal = this.isProductInCart(this.product.id);
    },
    "$store.state.favoritesModule.favorites"() {
      this.isProductInFavoritesLocal = this.isProductInFavorites(this.product.id);
    }
  },
  data() {
    return {
      isProductInCartLocal: false,
      isProductInFavoritesLocal: false
    };
  },
  created() {
    this.isProductInCartLocal = this.isProductInCart(this.product.id);
    this.isProductInFavoritesLocal = this.isProductInFavorites(this.product.id);
  },
  computed: {
    formattedPrice() {
      return stringFormatter.getFormattedPrice(this.product.price);
    }
  },
  methods: {
    handleProductCartActionLocal() {
      this.isProductInCartLocal = !this.isProductInCartLocal;
      this.handleProductCartAction(this.product.id)
        ?.catch(() => {
          this.isProductInCartLocal = this.isProductInCart(this.product.id);
        });
    },
    handleProductFavoriteActionLocal() {
      this.isProductInFavoritesLocal = !this.isProductInFavoritesLocal;
      this.handleProductFavoriteAction(this.product.id)
        ?.catch(() => {
          this.isProductInFavoritesLocal = this.isProductInFavorites(this.product.id);
        });
    }
  }
};
</script>

<style scoped lang="scss">
svg {
  &:hover {
    @apply text-dark-blue cursor-pointer;
  }
}

.wrapper {
  @apply flex flex-col pt-16 pb-10;
}

a {
  @apply cursor-default;
}

p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>