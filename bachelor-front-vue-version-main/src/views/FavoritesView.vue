<template>
  <div class="container flex self-center flex-col my-16 max-w-3xl grow"
       v-if="!$store.state.favoritesModule.isFavoritesLoading">
    <h1 class="mb-20" data-cy="favorites-page-header">{{ $t("yourFavorites") }}</h1>
    <ul class="flex flex-col gap-y-10" v-if="$store.state.favoritesModule.favorites.length">
      <li v-for="(favorite, index) in $store.state.favoritesModule.favorites" :key="favorite.id"
          :class="[$store.state.favoritesModule.favorites.length !== (index + 1) ? 'pb-10 border-b border-solid border-mid-gray' : '']">
        <products-list-item data-cy="favorite-item" :product="favorite"></products-list-item>
      </li>
    </ul>
    <div v-else class="items-center justify-center flex flex-col grow">
      <h4 class="text-spun-pearl">{{ $t("empty") }}</h4>
    </div>
  </div>
</template>

<script>

import ProductsListItem from "@/components/products_list/ProductsListItem";

export default {
  name: "FavoritesView",
  components: {
    ProductsListItem
  },
};
</script>

<style scoped></style>
