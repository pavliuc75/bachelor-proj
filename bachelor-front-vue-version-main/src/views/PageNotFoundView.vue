<template>
  <div class="container flex self-center flex-col my-16">
    <h3>{{ $t("pageNotFound") }}</h3>
    <p class="mt-4">
      {{ $t("sorryWeCannotFindThePage") }}
    </p>
  </div>
</template>

<script>
export default {
  name: "PageNotFoundView",
};
</script>

<style scoped></style>
