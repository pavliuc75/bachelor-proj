<template>
  <button
    v-on="$listeners"
    v-bind="$attrs"
    :disabled="isDisabled"
    :class="{
      'h-8 px-2': size === 'small',
      'h-14 px-5': size === 'medium',
      'text-mid-gray hover-is-disabled border-spun-pearl hover:border-spun-pearl': isDisabled,
    }"
    class="flex flex-none items-center tracking-[unset] hover:text-dark-blue hover:border-dark-blue border border-solid border-mid-gray rounded-lg"
  >
    <font-awesome-icon
      v-if="iconStart"
      :class="{ 'mr-2': size === 'small', 'mr-3': size === 'medium' }"
      :icon="iconStart"
      :size="getIconSize()"
    />
    <span
      :class="{ 'c-text-12': size === 'small', 'c-text-14': size === 'medium' }"
    >{{ text }}</span
    >
    <font-awesome-icon
      v-if="iconEnd"
      :class="{ 'ml-2': size === 'small', 'ml-3': size === 'medium' }"
      :icon="iconEnd"
      :size="getIconSize()"
    />
  </button>
</template>

<script>
export default {
  name: "CButtonPrimary",
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

<style>
.hover-is-disabled:hover {
  color: #69696C !important;
}
</style>
