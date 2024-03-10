<template>
  <div>
    <div :class="classStyling">
      <font-awesome-icon
        icon="fa-solid fa-info"
        class="text-mid-gray mr-3"
        size="sm"
      ></font-awesome-icon>
      <p>
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CInfo",
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "info"
    },
    size: {
      type: String,
      default: "md"
    }
  },
  computed: {
    classStyling() {
      let baseClasses = "border border-spun-pearl border-solid flex inline-flex";
      if (this.type === "error") {
        baseClasses += " bg-background-error";
      }
      if (this.type === "warning") {
        baseClasses += " bg-background-warning";
      }
      if (this.type === "success") {
        baseClasses += " bg-background-success";
      }
      if (this.size === "sm") {
        baseClasses += " pa-1";
      }
      if (this.size === "md") {
        baseClasses += " pa-4";
      }
      return baseClasses;
    }
  }
};
</script>

<style scoped></style>
