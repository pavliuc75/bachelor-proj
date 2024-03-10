<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <div class="flex flex-row items-center gap-4">
      <font-awesome-icon :title="getFormattedStatus(order.orderStatus)" icon="fa-solid fa-truck"
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
              <td>
                <c-menu is-radio :items="availableOrderStatuses">
                  <template #activator>
                    <c-button-primary icon-end="fa-solid fa-chevron-down" type="button"
                                      :text="getFormattedStatus(order.orderStatus)">
                    </c-button-primary>
                  </template>
                </c-menu>
              </td>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <product-item-from-order v-for="product in order.productList" :key="product.id"
                                     :product="product">
              <template #status>
                <c-menu
                  is-radio :items="getAvailableProductStatuses(product)">
                  <template #activator>
                    <c-button-primary icon-end="fa-solid fa-chevron-down" type="button"
                                      :text="getFormattedStatus(product.orderStatus)">
                    </c-button-primary>
                  </template>
                </c-menu>
              </template>
            </product-item-from-order>
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

<script lang="ts">
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import { stringFormatter } from "@/util/stringFormatter";
import Vue from "vue";
import dateFormatterMixin from "@/util/dateFormatterMixin";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import CDialog from "@/components/common/CDialog.vue";
import ProductItemFromOrder from "@/components/order_view/ProductItemFromOrder.vue";
import CMenu from "@/components/common/CMenu.vue";
import {
  OrderStatus,
  PatchOrderToFulfillProductStatusRequest,
  PatchOrderToFulfillStatusRequest,
  ProductInOrder
} from "@/generated-sources/openapi";

export default Vue.extend({
  name: "AdministratorOrderListItem",
  components: {
    CButtonSecondary,
    CButtonPrimary,
    CDialog,
    ProductItemFromOrder,
    CMenu
  },
  mixins: [dateFormatterMixin],
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedFullPrice() {
      let fullPrice = 0;
      this.order.productList.forEach((product: { price: number; amount: number; }) => {
        fullPrice += product.price * product.amount;
      });
      return stringFormatter.getFormattedPrice(fullPrice);
    },
    availableOrderStatuses() {
      let availableOrderStatuses = Object.values(OrderStatus);
      return availableOrderStatuses.map((status: string) => {
        return {
          name: this.getFormattedStatus(status),
          value: status,
          selected: this.order.orderStatus === status,
          function: () => {
            if (this.order.orderStatus !== status) {
              let patchOrderToFulfillStatusRequest: PatchOrderToFulfillStatusRequest = {
                orderId: this.order.id,
                status: status
              };
              this.$store.dispatch("administratorManagementToolModule/updateOrderStatus", patchOrderToFulfillStatusRequest);
            }
          }
        };
      });
    }
  },
  data() {
    return {
      isOrderDetailsDialogShown: false
    };
  },
  methods: {
    getFormattedStatus(status: string): string {
      return this.$t(stringFormatter.underscoreToCamelCase(status.toLowerCase()));
    },
    getAvailableProductStatuses(product: ProductInOrder) {
      let availableOrderStatuses = Object.values(OrderStatus);
      return availableOrderStatuses.map((status: string) => {
        return {
          name: this.getFormattedStatus(status),
          value: status,
          selected: product.orderStatus === status,
          function: () => {
            if (product.orderStatus !== status) {
              let patchOrderToFulfillProductStatusRequest: PatchOrderToFulfillProductStatusRequest = {
                orderId: this.order.id,
                productId: product.id,
                status: status
              };
              this.$store.dispatch("administratorManagementToolModule/updateProductStatus", patchOrderToFulfillProductStatusRequest);
            }
          }
        };
      });
    }
  }
});
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