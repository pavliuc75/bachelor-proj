<template>
  <button
    v-on="$listeners"
    v-bind="$attrs"
    :disabled="isDisabled"
    class="flex flex-none items-center tracking-[unset] underline hover:text-dark-blue hover:no-underline"
    :class="{
      'text-mid-gray hover-disabled no-underline': isDisabled,
    }"
  >
    <font-awesome-icon
      v-if="iconStart"
      :class="{ 'mr-2': size === 'small', 'mr-2.5': size === 'medium' }"
      :icon="iconStart"
      :size="getIconSize()"
    />
    <span
      :class="{ 'c-text-12': size === 'small', 'c-text-14': size === 'medium' }"
    >{{ text }}</span
    >
    <font-awesome-icon
      v-if="iconEnd"
      :class="{ 'ml-2': size === 'small', 'ml-2.5': size === 'medium' }"
      :icon="iconEnd"
      :size="getIconSize()"
    />
  </button>
</template>

<script>
export default {
  name: "CButtonSecondary",
  props: {
    text: {
      type: String,
      required: true
    },
    iconStart: {
      type: String
    },
    iconEnd: {
      type: String
    },
    size: {
      type: String,
      default: "small"
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getIconSize() {
      if (this.size === "small") return "2xs";
      if (this.size === "medium") return "xs";
    }
  }
};
</script>

<style scoped>
.hover-disabled:hover {
  color: #69696C !important;
  text-decoration: underline !important;
}
</style>
