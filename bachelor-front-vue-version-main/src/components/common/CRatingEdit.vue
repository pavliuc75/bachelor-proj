<template>
  <div class="flex flex-col cursor-pointer">
    <div class="flex flex-row items-center justify-between">
      <font-awesome-icon
        :class="{
          'text-spun-pearl': value < 1,
          'text-cinder': value >= 1,
          'text-dark-blue': hoveredValue >= 1,
        }"
        class="text-spun-pearl"
        icon="fa-solid fa-star"
        @mouseover="hoveredValue = 1"
        @click="handleChangeValue(1)"
        @mouseleave="hoveredValue = -1"
      />
      <font-awesome-icon
        :class="{
          'text-spun-pearl': value < 2,
          'text-cinder': value >= 2,
          'text-dark-blue': hoveredValue >= 2,
        }"
        class="text-spun-pearl"
        icon="fa-solid fa-star"
        @mouseover="hoveredValue = 2"
        @click="handleChangeValue(2)"
        @mouseleave="hoveredValue = -1"
      />
      <font-awesome-icon
        :class="{
          'text-spun-pearl': value < 3,
          'text-cinder': value >= 3,
          'text-dark-blue': hoveredValue >= 3,
        }"
        class="text-spun-pearl"
        icon="fa-solid fa-star"
        @click="handleChangeValue(3)"
        @mouseover="hoveredValue = 3"
        @mouseleave="hoveredValue = -1"
      >
      </font-awesome-icon>
      <font-awesome-icon
        :class="{
          'text-spun-pearl': value < 4,
          'text-cinder': value >= 4,
          'text-dark-blue': hoveredValue >= 4,
        }"
        class="text-spun-pearl"
        @mouseover="hoveredValue = 4"
        @mouseleave="hoveredValue = -1"
        @click="handleChangeValue(4)"
        icon="fa-solid fa-star"></font-awesome-icon>
      <font-awesome-icon
        :class="{
          'text-spun-pearl': value < 5,
          'text-cinder': value === 5,
          'text-dark-blue': hoveredValue >= 5,
        }"
        class="text-spun-pearl"
        @mouseover="hoveredValue = 5"
        @mouseleave="hoveredValue = -1"
        @click="handleChangeValue(5)"
        icon="fa-solid fa-star">
      </font-awesome-icon>
    </div>
  </div>
</template>

<script>

export default {
  name: "CRatingEdit",
  data() {
    return {
      hoveredValue: -1
    };
  },
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  methods: {
    handleChangeValue(value) {
      this.$emit("update", value);
    }
  }
};
</script>

<style scoped>
.text-dark-blue {
  color: var(--dark-blue) !important;
}
</style>