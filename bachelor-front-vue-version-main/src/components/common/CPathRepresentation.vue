<template>
  <div class="flex flex-row items-center">
    <div
      v-for="(directory, index) in directories"
      :key="index"
      class="flex flex-row items-center"
    >
      <template v-if="index !== directories.length - 1">
        <router-link :to="directory.route">
          <c-button-secondary class="text-left" :text="directory.name"></c-button-secondary>
        </router-link>
        <font-awesome-icon
          v-if="index !== directories.length-2 ||directories[directories.length - 1].name"
          class="mx-2"
          size="2xs"
          data-test="chevron"
          icon="fa-solid fa-chevron-right"
        ></font-awesome-icon>
      </template>
      <span v-else class="c-text-12 text-left">{{ directory.name }}</span>
    </div>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";

export default {
  name: "CPathRepresentation",
  props: {
    directories: {
      type: Array,
      required: true
    }
  },
  components: {
    CButtonSecondary
  }
};
</script>

<style scoped></style>
