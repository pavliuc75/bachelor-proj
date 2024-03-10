export default {
  methods: {
    handleProductCartAction(productId) {
      if (this.$keycloak.authenticated) {
        if (this.isProductInCart(productId)) {
          return this.$store.dispatch("cartModule/removeProductFromCart", {
            productId: productId, isInstantLoading: false
          });
        } else {
          return this.$store.dispatch("cartModule/addProductToCart", productId);
        }
      } else {
        this.$keycloak.login({
          redirectUri: process.env.VUE_APP_URL + this.$route.fullPath
        });
      }
    }, isProductInCart(productId) {
      return this.$store.state.cartModule.products.some((product) => product?.product.id === productId);
    }
  }

};