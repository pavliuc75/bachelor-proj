<template>
  <div class="flex flex-col">
    <div :class="`grid gap-x-20 container self-center`"
         :style="{gridTemplateColumns: `repeat(${productsPerShelf}, minmax(0, 1fr))`}">
      <products-shelf-item
        v-for="(product) in products"
        :key="product.id"
        :product="product"
      ></products-shelf-item>
    </div>
    <div class="border-b border-solid border-mid-gray container self-center"></div>
  </div>
</template>

<script>
import ProductsShelfItem from "@/components/products_grid/ProductsShelfItem";

export default {
  name: "ProductsShelf",
  components: {
    ProductsShelfItem
  },
  props: {
    products: {
      type: Array,
      required: true
    },
    productsPerShelf: {
      type: Number,
      required: true
    }
  },
};
</script>

<style scoped>

</style>