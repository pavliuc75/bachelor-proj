<template>
  <v-app>
    <c-loading-overlay></c-loading-overlay>
    <c-snackbar></c-snackbar>
    <navigation-bar></navigation-bar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import NavigationBar from "@/components/navigation_bar/NavigationBar";
import CSnackbar from "@/components/common/CSnackbar";
import CLoadingOverlay from "@/components/common/CLoadingOverlay";
export default {
  name: "App",
  components: {
    CSnackbar,
    NavigationBar,
    CLoadingOverlay
  },
  created() {
    if (this.$keycloak.authenticated)
        this.$store.dispatch("userModule/fetchCurrentUserData");
  }
};
</script>
