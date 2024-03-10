<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("orders") }}</h2>
    <c-tabs-navigation @tabSelected="handleTabSelected"
                       class="mb-2" :tabs="tabs"></c-tabs-navigation>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.businessManagementToolModule.orders.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <business-order-list-item
          v-for="order in $store.state.businessManagementToolModule.orders"
          :key="order.id"
          :order="order">
        </business-order-list-item>
      </div>
      <c-pagination
        v-if="$store.state.businessManagementToolModule.ordersTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.businessManagementToolModule.ordersTotalPages"
        :current-page="$store.state.businessManagementToolModule.ordersCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import CPagination from "@/components/common/CPagination.vue";
import CTabsNavigation from "@/components/common/CTabsNavigation.vue";
import BusinessOrderListItem from "@/components/business_management_tool_view/BusinessOrderListItem.vue";

export default {
  name: "BusinessManagementToolViewOrders",
  components: {
    CPagination,
    BusinessOrderListItem,
    CTabsNavigation
  },
  computed: {
    tabs() {
      return [
        {
          name: this.$t("allOrders"),
          value: "ALL",
          selected: this.$store.state.businessManagementToolModule.ordersCurrentFilter === "ALL"
        },
        {
          name: this.$t("awaitingShipment"),
          value: "AWAITING_SHIPMENT",
          selected: this.$store.state.businessManagementToolModule.ordersCurrentFilter === "AWAITING_SHIPMENT"
        },
        {
          name: this.$t("readyForShipment"),
          value: "READY_FOR_SHIPMENT",
          selected: this.$store.state.businessManagementToolModule.ordersCurrentFilter === "READY_FOR_SHIPMENT"
        },
        {
          name: this.$t("shipped"),
          value: "SHIPPED",
          selected: this.$store.state.businessManagementToolModule.ordersCurrentFilter === "SHIPPED"
        },
        {
          name: this.$t("awaitingPickup"),
          value: "AWAITING_PICKUP",
          selected: this.$store.state.businessManagementToolModule.ordersCurrentFilter === "AWAITING_PICKUP"
        },
        {
          name: this.$t("completed"),
          value: "COMPLETED",
          selected: this.$store.state.businessManagementToolModule.ordersCurrentFilter === "COMPLETED"
        }
      ];
    }
  },
  created() {
    this.fetchOrdersLocal(1);
  },
  methods: {
    handleTabSelected(tab) {
      this.$store.commit("businessManagementToolModule/setOrdersCurrentFilter", tab.value);
      this.fetchOrdersLocal(1);
    },
    handlePageChange(page) {
      this.fetchOrdersLocal(page);
    },
    fetchOrdersLocal(page) {
      this.$store.dispatch("businessManagementToolModule/fetchOrders", page);
    }
  }
};
</script>

<style scoped>

</style>