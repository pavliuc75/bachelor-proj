<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <div class="flex flex-row items-center gap-4">
      <font-awesome-icon :title="getFormattedStatus(order.orderStatus)" icon="fa-solid fa-check" class="text-mid-gray"
                         v-if="order.orderStatus === 'COMPLETED'"></font-awesome-icon>
      <font-awesome-icon :title="getFormattedStatus(order.orderStatus)" v-else icon="fa-solid fa-truck"
                         class="text-mid-gray"></font-awesome-icon>
      <span class="c-text-14 truncate">{{ $t("orderFrom") + " " + getFormattedDateTime(new Date(order.createdDate))
        }}</span>
    </div>
    <c-button-secondary @click="isOrderDetailsDialogShown = true" :text="$t('seeDetails')"></c-button-secondary>
    <c-dialog v-model="isOrderDetailsDialogShown" width="1000">
      <template #title>
        <h3>{{ $t("orderFrom") + " " + getFormattedDateTime(new Date(order.createdDate)) }}</h3>
      </template>
      <template #body>
        <div class="flex flex-col">
          <h4 class="mt-8">{{ $t("generalOrderInformation") }}</h4>
          <table class="mt-4">
            <tbody>
            <tr>
              <td class="sm:w-[30%]"><p>{{ $t("orderDate") }}</p></td>
              <td><span class="label block">{{ getFormattedDateTime(new Date(order.createdDate)) }}</span></td>
            </tr>
            <tr>
              <td><p>{{ $t("status") }}</p></td>
              <td><span class="label block">{{ getFormattedStatus(order.orderStatus) }}</span></td>
            </tr>
            <tr>
              <td><p>{{ $t("totalPrice") }}</p></td>
              <td><span class="label block">{{ formattedFullPrice }}</span></td>
            </tr>
            </tbody>
          </table>
          <h4 class="mt-8">{{ $t("shippingDetails") }}</h4>
          <table class="mt-4">
            <tbody>
            <tr>
              <td class="sm:w-[30%]"><p>{{ $t("city") }}</p></td>
              <td><span class="label block">{{ order.shippingDetails.city }}</span></td>
            </tr>
            <tr>
              <td><p>{{ $t("address") }}</p></td>
              <td>
                <a :href="'https://maps.google.com/?q=' + order.shippingDetails.address" target="_blank">
                  <c-button-secondary
                    class="text-start"
                    size="medium"
                    :text="order.shippingDetails.address"
                  ></c-button-secondary>
                </a>
              </td>
            </tr>
            <tr>
              <td><p>{{ $t("postalCode") }}</p></td>
              <td><span class="label block">{{ order.shippingDetails.postalCode }}</span></td>
            </tr>
            </tbody>
          </table>
          <h4 class="mt-8">{{ $t("orderedProducts") }}</h4>
          <div v-for="(orderItem, index) in order.orderItems" :key="orderItem.id"
               :class="[index !== 0 ? 'mt-2': '', 'flex flex-col grow']">
            <table class="mt-4">
              <tbody>
              <tr>
                <td class="sm:w-[30%]"><p>{{ $t("company") }}</p></td>
                <td>
                  <router-link target="_blank"
                               :to="{name: 'businessPage', params: {businessPageId: orderItem.fulfilledBy}}">
                    <c-button-secondary size="medium"
                                        :text="getBusinessNameById(orderItem.fulfilledBy)"></c-button-secondary>
                  </router-link>
                </td>
              </tr>
              <tr>
                <td><p>{{ $t("status") }}</p></td>
                <td><span class="label block">{{ getFormattedStatus(orderItem.orderStatus) }}</span></td>
              </tr>
              </tbody>
            </table>
            <div class="mt-2 flex flex-col">
              <p class="mb-3">{{ $t("products") }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-wrap">
                <product-item-from-order v-for="product in orderItem.productList" :key="product.id"
                                         :product="product" :order-status="product.orderStatus"
                >
                </product-item-from-order>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="mt-6 flex items-center justify-end">
          <c-button-secondary @click="isOrderDetailsDialogShown = false" :text="$t('close')"></c-button-secondary>
        </div>
      </template>
    </c-dialog>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CDialog from "@/components/common/CDialog.vue";
import dateFormatterMixin from "@/util/dateFormatterMixin";
import { stringFormatter } from "@/util/stringFormatter";
import ProductItemFromOrder from "@/components/order_view/ProductItemFromOrder.vue";

export default {
  name: "OrderListItem",
  components: {
    CDialog,
    CButtonSecondary,
    ProductItemFromOrder
  },
  mixins: [dateFormatterMixin],
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  watch: {
    isOrderDetailsDialogShown(newValue) {
      if (newValue) {
        let listOfRelatedBusinessIds = this.order.orderItems.map(orderItem => orderItem.fulfilledBy);
        let listOfWhetherNameOfBusinessIsAlreadyKnown = listOfRelatedBusinessIds.map(businessId => {
          return this.$store.state.businessModule.businessPages.some(businessPage => businessPage.id === businessId);
        });
        if (listOfWhetherNameOfBusinessIsAlreadyKnown.some(isKnown => !isKnown)) {
          this.$store.dispatch("businessModule/fetchBusinessPages", 999);
        }
      }
    }
  },
  computed: {
    formattedFullPrice() {
      let fullPrice = 0;
      this.order.orderItems.forEach(orderItem => {
        orderItem.productList.forEach(product => {
          fullPrice += product.price * product.amount;
        });
      });
      return stringFormatter.getFormattedPrice(fullPrice);
    },
    formattedPrice() {
      return stringFormatter.getFormattedPrice(-1);
    }
  },
  data() {
    return {
      isOrderDetailsDialogShown: false
    };
  },
  methods: {
    getFormattedStatus(status) {
      return this.$t(stringFormatter.underscoreToCamelCase(status.toLowerCase()));
    },
    getBusinessNameById(businessId) {
      return this.$store.state.businessModule.businessPages
        .find(businessPage => businessPage.id === businessId)?.businessDescription.legalName || "";
    }
  }
};
</script>

<style scoped>
td p:first-child {
  @apply pr-10;
}

table td {
  border-top: 8px solid transparent;
  vertical-align: top;
}

table tr:first-child td {
  border-top: 0;
}
</style>