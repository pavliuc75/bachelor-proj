<template>
  <div class="container flex self-center flex-col my-16 max-w-3xl">
    <h1 class="mb-10">{{ $t("categories") }}</h1>
    <ul class="ml-8 flex flex-col gap-3">
      <li :key="-1">
        <router-link :to="{name: 'base'}">
          <c-button-secondary
            size="medium"
            :text="$t('allProducts')"
          ></c-button-secondary>
        </router-link>
      </li>
      <li v-for="category in $store.state.productModule.categories" :key="category.id">
        <router-link :to="{name: 'base', query: {categories: category.id}}">
          <c-button-secondary
            size="medium"
            :text="$t(category.category?.toLowerCase())"
          ></c-button-secondary>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";

export default {
  name: "CategoriesView",
  components: {
    CButtonSecondary
  },
  created() {
    if (!this.$store.state.productModule.categories.length)
      this.$store.dispatch("productModule/fetchCategories", true);
  }
};
</script>

<style scoped>

</style>