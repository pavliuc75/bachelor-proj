<template>
  <div class="container flex self-center flex-col my-16 max-w-3xl">
    <h1 class="mb-10">{{ $t("createBusinessPage") }}</h1>
    <edit-business-page is-create></edit-business-page>
  </div>
</template>

<script>
import EditBusinessPage from "@/components/edit_business_page_view/EditBusinessPage";

export default {
  name: "CreateBusinessPageView",
  components: {
    EditBusinessPage
  }
};
</script>

<style scoped>
</style>
