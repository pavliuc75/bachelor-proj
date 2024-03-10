export default {
  methods: {
    handleProductFavoriteAction(productId) {
      if (this.$keycloak.authenticated) {
        if (this.isProductInFavorites(productId)) {
          return this.$store.dispatch("favoritesModule/removeProductFromFavorites", {
            productId: productId,
            isInstantLoading: false
          });
        } else {
          return this.$store.dispatch("favoritesModule/addProductToFavorites", productId);
        }
      } else {
        this.$keycloak.login({
          redirectUri: process.env.VUE_APP_URL + this.$route.fullPath
        });
      }
    }, isProductInFavorites(productId) {
      return this.$store.state.favoritesModule.favorites.some((product) => product.id === productId);
    }
  }

};