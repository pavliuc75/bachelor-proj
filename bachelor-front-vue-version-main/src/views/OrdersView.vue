<template>
  <div class="container flex self-center flex-col my-16 max-w-3xl grow">
    <h1 class="mb-10">{{ $t("myOrders") }}</h1>
    <c-tabs-navigation @tabSelected="handleTabSelected"
                       class="mb-2" :tabs="tabs"></c-tabs-navigation>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.ordersModule.orders.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <order-list-item
          v-for="order in $store.state.ordersModule.orders"
          :key="order.id"
          :order="order">
        </order-list-item>
      </div>
      <c-pagination
        v-if="$store.state.ordersModule.ordersTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.ordersModule.ordersTotalPages"
        :current-page="$store.state.ordersModule.ordersCurrentPage"
      ></c-pagination>
    </div>
    <c-dialog v-model="isCheckoutSuccessDialogShown" :title-text="$t('orderConfirmed')"
              :subtitle-text="$t('orderConfirmedDescription')">
      <template #footer>
        <div class="flex flex-row justify-end mt-3">
          <c-button-primary @click="handleCloseCheckoutSuccessDialog()" :text="$t('confirm')"></c-button-primary>
        </div>
      </template>
    </c-dialog>
  </div>
</template>

<script>
import CPagination from "@/components/common/CPagination.vue";
import OrderListItem from "@/components/order_view/OrderListItem.vue";
import CTabsNavigation from "@/components/common/CTabsNavigation.vue";
import CDialog from "@/components/common/CDialog.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";

export default {
  name: "OrdersView",
  components: {
    CButtonPrimary,
    CDialog,
    CPagination,
    OrderListItem,
    CTabsNavigation
  },
  computed: {
    tabs() {
      return [
        {
          name: this.$t("allOrders"),
          value: "ALL",
          selected: this.$store.state.ordersModule.ordersCurrentFilter === "ALL"
        },
        {
          name: this.$t("awaitingShipment"),
          value: "AWAITING_SHIPMENT",
          selected: this.$store.state.ordersModule.ordersCurrentFilter === "AWAITING_SHIPMENT"
        },
        {
          name: this.$t("shipped"),
          value: "SHIPPED",
          selected: this.$store.state.ordersModule.ordersCurrentFilter === "SHIPPED"
        },
        {
          name: this.$t("awaitingPickup"),
          value: "AWAITING_PICKUP",
          selected: this.$store.state.ordersModule.ordersCurrentFilter === "AWAITING_PICKUP"
        },
        {
          name: this.$t("completed"),
          value: "COMPLETED",
          selected: this.$store.state.ordersModule.ordersCurrentFilter === "COMPLETED"
        }
      ];
    }
  },
  created() {
    this.fetchOrdersLocal(1);
  },
  mounted() {
    if (this.$route.query.success === "true") {
      setTimeout(() => {
        this.fetchOrdersLocal(1);
      }, 3000);
      this.isCheckoutSuccessDialogShown = true;
    }
  },
  data() {
    return {
      isCheckoutSuccessDialogShown: false
    };
  },
  methods: {
    handleTabSelected(tab) {
      this.$store.commit("ordersModule/setOrdersCurrentFilter", tab.value);
      this.fetchOrdersLocal(1);
    },
    handleCloseCheckoutSuccessDialog() {
      this.isCheckoutSuccessDialogShown = false;
      this.$router.replace({ query: { success: "null" } });
    },
    handlePageChange(page) {
      this.fetchOrdersLocal(page);
    },
    fetchOrdersLocal(page) {
      this.$store.dispatch("ordersModule/fetchOrders", page);
    }
  }
};
</script>

<style scoped>

</style>