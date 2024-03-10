<template>
  <div class="flex flex-row gap-6">
    <router-link :to="{name: 'product', params: {productId: product.id}}" class="shrink-0">
      <img
        :src="product.mainImage.imageUrl"
        @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
        alt=""
        class="rounded-lg aspect-square w-[96px] sm:w-[144px] self-start object-cover"
      />
    </router-link>
    <div class="flex flex-col grow min-w-0">
      <div class="flex flex-row justify-space-between">
        <router-link :to="{name: 'product', params: {productId: product.id}}"
                     class="block font-bold cursor-default truncate">
          <span :title="product.name">{{ product.name }}</span>
        </router-link>
        <span class="block font-bold shrink-0 ml-2">{{ formattedPrice }}</span>
      </div>
      <router-link :to="{name: 'product', params: {productId: product.id}}">
        <p class="text-cinder break-words" :title="product.description">{{ product.description }}</p>
      </router-link>
      <div v-if="mode === 'favorite'" class="mt-7 flex flex-row gap-5">
        <c-button-secondary type="button" v-if="!isProductInCart(product.id)" @click="handleMoveItemToCart()"
                            :text="$t('moveToCart')" data-cy="move-item-to-cart-button" />
        <c-button-secondary type="button" data-cy="remove-item-from-favorites-button" @click="handleRemoveItemFromFavorites()" :text="$t('remove')" />
      </div>
      <div v-else class="mt-7 flex flex-row gap-5 flex-wrap">
         <c-menu
          is-radio
          :items="quantityValues"
        >
          <template #activator>
            <c-button-primary
              type="button"
              :text="amount.toString()"
              icon-end="fa-solid fa-chevron-down"
            ></c-button-primary>
          </template>
        </c-menu>
        <c-button-secondary v-if="!isProductInFavorites(product.id)" type="button" :text="$t('moveToFavorites')"
                            @click="handleMoveToFavorites()" />
        <c-button-secondary type="button" data-cy="remove-item-from-cart-button" @click="handleRemoveItemFromCart()"
                            :text="$t('remove')" />
      </div>
    </div>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import CMenu from "@/components/common/CMenu";
import CButtonPrimary from "@/components/common/CButtonPrimary";
import { stringFormatter } from "@/util/stringFormatter";
import cartProductMixin from "@/components/cart_view/cartProductMixin";
import favoritesProductMixin from "@/components/favorites_view/favoritesProductMixin";

export default {
  name: "ProductsListItem",
  components: {
    CButtonSecondary,
    CMenu,
    CButtonPrimary
  },
  mixins: [cartProductMixin, favoritesProductMixin],
  props: {
    mode: {
      type: String,
      default: "favorite"
    },
    product: {
      type: Object,
      required: true
    },
    amount: {
      type: Number
    }
  },
  computed: {
    formattedPrice() {
      if (this.mode === "cart") {
        return stringFormatter.getFormattedPrice(this.product.price * this.amount);
      } else {
        return stringFormatter.getFormattedPrice(this.product.price);
      }
    },
    quantityValues() {
      if (this.mode === "cart") {
        return Array.from({ length: 20 }, (_, i) => i + 1).map((value) => ({
          name: value.toString(),
          selected: value.toString() === this.amount.toString(),
          function: () => this.handleQuantityChange(value)
        }));
      }
      return [];
    }
  },
  methods: {
    handleRemoveItemFromCart() {
      this.$store.dispatch("cartModule/removeProductFromCart", { productId: this.product.id, isInstantLoading: true });
    },
    handleQuantityChange(value) {
      this.$store.dispatch("cartModule/updateProductAmount", { productId: this.product.id, amount: value });
    },
    handleMoveToFavorites() {
      this.$store.dispatch("favoritesModule/addProductToFavorites", this.product.id);
      this.$store.dispatch("cartModule/removeProductFromCart", { productId: this.product.id, isInstantLoading: true });
    },
    handleMoveItemToCart() {
      this.$store.dispatch("cartModule/addProductToCart", this.product.id);
      this.$store.dispatch("favoritesModule/removeProductFromFavorites", {
        productId: this.product.id,
        isInstantLoading: true
      });
    },
    handleRemoveItemFromFavorites() {
      this.$store.dispatch("favoritesModule/removeProductFromFavorites", {
        productId: this.product.id,
        isInstantLoading: true
      });
    }
  }
};
</script>

<style scoped>
p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

a {
  @apply cursor-default;
}
</style>