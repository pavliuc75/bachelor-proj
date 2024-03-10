<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("orders") }}</h2>
    <c-tabs-navigation @tabSelected="handleTabSelected"
                       class="mb-2" :tabs="tabs"></c-tabs-navigation>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="!$store.state.administratorManagementToolModule.orders.length">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
    <div v-else class="flex flex-col">
      <div class="flex flex-col gap-y-3">
        <administrator-order-list-item
          v-for="order in $store.state.administratorManagementToolModule.orders"
          :key="order.id"
          :order="order">
        </administrator-order-list-item>
      </div>
      <c-pagination
        v-if="$store.state.administratorManagementToolModule.ordersTotalPages > 1"
        @currentPageChanged="handlePageChange"
        class="mt-8 self-center"
        :total-pages="$store.state.administratorManagementToolModule.ordersTotalPages"
        :current-page="$store.state.administratorManagementToolModule.ordersCurrentPage"
      ></c-pagination>
    </div>
  </div>
</template>

<script>
import CTabsNavigation from "@/components/common/CTabsNavigation.vue";
import CPagination from "@/components/common/CPagination.vue";
import AdministratorOrderListItem from "@/components/administrator_management_tool_view/AdministratorOrderListItem.vue";

export default {
  name: "AdministratorManagementToolViewOrders",
  components: { AdministratorOrderListItem, CPagination, CTabsNavigation },
  computed: {
    tabs() {
      return [
        {
          name: this.$t("allOrders"),
          value: "ALL",
          selected: this.$store.state.administratorManagementToolModule.ordersCurrentFilter === "ALL"
        },
        {
          name: this.$t("awaitingShipment"),
          value: "AWAITING_SHIPMENT",
          selected: this.$store.state.administratorManagementToolModule.ordersCurrentFilter === "AWAITING_SHIPMENT"
        },
        {
          name: this.$t("readyForShipment"),
          value: "READY_FOR_SHIPMENT",
          selected: this.$store.state.administratorManagementToolModule.ordersCurrentFilter === "READY_FOR_SHIPMENT"
        },
        {
          name: this.$t("shipped"),
          value: "SHIPPED",
          selected: this.$store.state.administratorManagementToolModule.ordersCurrentFilter === "SHIPPED"
        },
        {
          name: this.$t("awaitingPickup"),
          value: "AWAITING_PICKUP",
          selected: this.$store.state.administratorManagementToolModule.ordersCurrentFilter === "AWAITING_PICKUP"
        },
        {
          name: this.$t("completed"),
          value: "COMPLETED",
          selected: this.$store.state.administratorManagementToolModule.ordersCurrentFilter === "COMPLETED"
        }
      ];
    }
  },
  created() {
    this.fetchOrdersLocal(1);
  },
  methods: {
    handleTabSelected(tab) {
      this.$store.commit("administratorManagementToolModule/setOrdersCurrentFilter", tab.value);
      this.fetchOrdersLocal(1);
    },
    handlePageChange(page) {
      this.fetchOrdersLocal(page);
    },
    fetchOrdersLocal(page) {
      this.$store.dispatch("administratorManagementToolModule/fetchOrders", page);
    }
  }
};
</script>

<style scoped>

</style>