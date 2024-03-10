<template>
  <v-overlay
    class="cursor-progress"
    style="z-index: 9999"
    color="white"
    opacity="0.66"
    :value="isLoadingOverlayShown"
  >
  </v-overlay>
</template>

<script>
export default {
  name: "CLoadingOverlay",
  watch: {
    "$store.state.eventModule.loadingOverlay.isShown"(newValue) {
      if (newValue) {
        this.showLoadingOverlay();
      } else {
        this.isLoadingOverlayShown = false;
      }
    },
  },
  data() {
    return {
      isLoadingOverlayShown: false,
    };
  },
  methods: {
    showLoadingOverlay() {
      if (this.$store.state.eventModule.loadingOverlay.isInstant) {
        this.isLoadingOverlayShown = true;
      } else {
        setTimeout(() => {
          this.isLoadingOverlayShown =
            this.$store.state.eventModule.loadingOverlay.isShown;
        }, 3000);
      }
    },
  },
};
</script>

<style scoped></style>
