<template>
  <v-snackbar
    timeout="6000"
    right
    light
    transition="slide-x-reverse-transition"
    v-model="isSnackbarShownLocal"
    :content-class="contentClass"
  >
    {{ $store.state.eventModule.snackbar.message }}
  </v-snackbar>
</template>

<script>
export default {
  name: "CSnackbar",
  computed: {
    isSnackbarShownLocal: {
      get() {
        return this.$store.state.eventModule.snackbar.isShown;
      },
      set() {
        this.$store.dispatch("eventModule/hideSnackbar");
      }
    },
    contentClass() {
      let baseClasses =
        "border border-mid-gray border-solid bg-white-lilac tracking-[unset] h-16 px-5 py-0 flex items-center c-text-12 text-cinder";
      if (this.$store.state.eventModule.snackbar.type === "error") {
        return baseClasses + " bg-background-error";
      }
      return baseClasses;
    }
  }
};
</script>

<style scoped>
/deep/ .v-snack__wrapper {
  @apply shadow-none !important;
  min-width: 300px;
}

/deep/ .v-snack__action {
  margin-right: 0;
}
</style>
