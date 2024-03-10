<template>
  <div class="flex flex-row gap-3 flex-wrap">
    <div v-for="(tab, index) in tabs" :key="index">
      <span v-if="tab.selected" class="block c-text-12 text-mid-gray cursor-default">{{ tab.name }}</span>
      <c-button-secondary @click="$emit('tabSelected', tab)" v-else type="button" :text="tab.name"></c-button-secondary>
    </div>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";

export default {
  name: "CTabsNavigation",
  components: {
    CButtonSecondary
  },
  props: {
    tabs: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>

</style>