<template>
  <div class="border border-solid border-mid-gray px-3 py-3 gap-4 flex flex-col sm:flex-row min-w-0">
    <img
      :src="product.mainImage.imageUrl"
      @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
      alt=""
      class="rounded-lg w-12 h-12 aspect-square object-cover self-start"
    />
    <table class="min-w-0">
      <tbody>
      <tr>
        <td><p>{{ $t("name") }}</p></td>
        <router-link target="_blank" class="block cursor-default"
                     :to="{name: 'product', params: {productId: product?.id}}">
          <c-button-secondary size="medium" :text="product.name"></c-button-secondary>
        </router-link>
      </tr>
      <tr>
        <td><p>{{ $t("status") }}</p></td>
        <td><span class="label block">
          <slot name="status" :product="{product}">
            {{ formattedStatus }}
          </slot>
        </span></td>
      </tr>
      <tr>
        <td><p>{{ $t("price") }}</p></td>
        <td><span class="label block">{{ formattedPrice }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("amount") }}</p></td>
        <td><span class="label block">{{ product.amount }}</span></td>
      </tr>
      <tr>
        <td class="mr-2"><p>{{ $t("totalPrice") }}</p></td>
        <td><span class="label block">{{ fullFormattedPrice }}</span></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { stringFormatter } from "@/util/stringFormatter";
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";

export default {
  name: "ProductItemFromOrder",
  components: { CButtonSecondary },
  props: {
    product: {
      type: Object
    },
    orderStatus: {
      type: String,
      default: "..."
    }
  },
  computed: {
    formattedStatus() {
      return this.$t(stringFormatter.underscoreToCamelCase(this.orderStatus.toLowerCase()));
    },
    formattedPrice() {
      return stringFormatter.getFormattedPrice(this.product.price);
    },
    fullFormattedPrice() {
      return stringFormatter.getFormattedPrice(this.product.price * this.product.amount);
    }
  }
};
</script>

<style scoped>
td:first-child p {
  @apply mr-4;
}

table td {
  border-top: 8px solid transparent;
  vertical-align: top;
}

table tr:first-child td {
  border-top: 0;
}
</style>