<template>
  <div class="container flex self-center flex-col my-16 grow">
    <div v-if="!$store.state.cartModule.isCartLoading" class="flex grow flex-col">
      <h1 class="mb-20" data-cy="cart-page-header">{{ $t("cart") }}</h1>
      <div class="flex flex-col-reverse lg:flex-row gap-x-20 gap-y-16" v-if="$store.state.cartModule.products.length">
        <div class="flex lg:w-2/3 flex-col">
          <ul class="flex flex-col gap-y-10">
            <li v-for="(product, index) in $store.state.cartModule.products" :key="product.id"
                :class="[$store.state.cartModule.products.length !== (index + 1) ? 'pb-10 border-b border-solid border-mid-gray' : '']">
              <products-list-item data-cy="cart-item" mode="cart" :amount="product.amount" :product="product.product"></products-list-item>
            </li>
          </ul>
        </div>
        <div
          class="max-w-[440px] flex flex-col lg:w-1/3 border border-solid border-mid-gray lg:self-start pa-10 lg:sticky lg:top-16">
          <span class="block c-text-14 font-bold">{{ $t("order") }}</span>
          <div class="pt-5 flex flex-row justify-space-between">
            <p class="text-cinder">{{ $t("priceOfProducts") }}</p>
            <p class="text-cinder">{{ formattedTotalPrice }}</p>
          </div>
          <div class="py-5 flex flex-row justify-space-between border-b border-solid border-mid-gray">
            <p class="text-cinder">{{ $t("deliveryPrice") }}</p>
            <p class="text-cinder">0 MDL</p>
          </div>
          <div class="flex flex-row justify-space-between mt-5 mb-10">
            <span class="block c-text-14 font-bold">{{ $t("totalPrice") }}</span>
            <span class="block font-bold text-[22px] leading-145">{{ formattedTotalPrice }}</span>
          </div>
          <c-button-primary
            @click="handleCheckout()"
            icon-end="fa-solid fa-angles-right"
            class="self-start"
            type="button"
            size="medium"
            :text="$t('toCheckout')">
          </c-button-primary>
        </div>
      </div>
      <div v-else class="items-center justify-center flex flex-col grow">
        <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
      </div>
    </div>
    <c-dialog v-model="isCheckoutFailureDialogShown" :title-text="$t('orderFailed')"
              :subtitle-text="$t('orderFailedDescription')">
      <template #footer>
        <div class="flex flex-row justify-end mt-3">
          <c-button-primary @click="handleCloseCheckoutFailureDialog()" :text="$t('confirm')"></c-button-primary>
        </div>
      </template>
    </c-dialog>
  </div>
</template>

<script>
import CButtonPrimary from "@/components/common/CButtonPrimary";
import ProductsListItem from "@/components/products_list/ProductsListItem";
import { stringFormatter } from "@/util/stringFormatter";
import CDialog from "@/components/common/CDialog.vue";

export default {
  name: "CartView",
  components: {
    CDialog,
    CButtonPrimary,
    ProductsListItem
  },
  computed: {
    formattedTotalPrice() {
      let totalPrice = 0;
      this.$store.state.cartModule.products.forEach(product => {
        totalPrice += product.product.price * product.amount;
      });
      return stringFormatter.getFormattedPrice(totalPrice);
    }
  },
  mounted() {
    if (this.$route.query.success === "false") {
      this.isCheckoutFailureDialogShown = true;
    }
  },
  data() {
    return {
      isCheckoutFailureDialogShown: false
    };
  },
  methods: {
    handleCheckout() {
      this.$store.dispatch("cartModule/checkout")
        .then(({ data }) => {
          window.location.replace(data.redirectUrl);
        })
        .catch((e) => {
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$t("failedToCheckout"),
            type: "error"
          });
        });
    },
    handleCloseCheckoutFailureDialog() {
      this.isCheckoutFailureDialogShown = false;
      this.$router.replace({ query: { success: "null" } });
    }
  }
  //todo recycle after checkout
};
</script>

<style scoped></style>
