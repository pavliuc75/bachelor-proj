<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("stats") }}</h2>
    <div
      class="flex flex-col grow items-center justify-center"
      v-if="$store.state.administratorManagementToolModule.isGeneralStatsLoading">
      <h4 class="text-spun-pearl">{{ $t("loading") }}...</h4>
    </div>
    <table data-cy="analytics-table" v-else-if="$store.state.administratorManagementToolModule.generalStats" class="max-w-sm">
      <tbody>
      <tr>
        <td><p>{{ $t("totalRevenue") }}</p></td>
        <td><span class="label block">{{ $store.state.administratorManagementToolModule.generalStats.totalRevenue
          }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("totalNumberOfOrders") }}</p></td>
        <td><span class="label block">{{ $store.state.administratorManagementToolModule.generalStats.totalNumberOfOrders
          }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("totalNumberOfCompletedOrders") }}</p></td>
        <td><span
          class="label block">{{ $store.state.administratorManagementToolModule.generalStats.totalNumberOfCompletedOrders
          }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("totalNumberOfInProgressOrders") }}</p></td>
        <td><span
          class="label block">{{ $store.state.administratorManagementToolModule.generalStats.totalNumberOfInProgressOrders
          }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("totalNumberOfProducts") }}</p></td>
        <td><span
          class="label block">{{ $store.state.administratorManagementToolModule.generalStats.totalNumberOfProducts
          }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("totalNumberOfCustomers") }}</p></td>
        <td><span
          class="label block">{{ $store.state.administratorManagementToolModule.generalStats.totalNumberOfCustomers
          }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("totalNumberOfBusinesses") }}</p></td>
        <td><span
          class="label block">{{ $store.state.administratorManagementToolModule.generalStats.totalNumberOfBusinesses
          }}</span></td>
      </tr>
      </tbody>
    </table>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  name: "AdministratorManagementToolViewStats",
  created() {
    if (!this.$store.state.administratorManagementToolModule.generalStats) {
      this.$store.dispatch("administratorManagementToolModule/fetchGeneralStats");
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