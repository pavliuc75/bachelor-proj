<template>
  <div class="container flex self-center flex-col my-16 max-w-3xl">
    <h1 class="mb-10" data-cy="companies-header">{{ $t("companies") }}</h1>
    <ul class="ml-8 flex flex-col gap-3">
      <li v-for="businessPage in $store.state.businessModule.businessPages" :key="businessPage.id">
        <router-link :to="{name: 'businessPage', params: {businessPageId: businessPage.id}}" data-cy="business-page-button">
          <c-button-secondary
            @click="$emit('closeClicked')"
            size="medium"
            :text="businessPage.businessDescription.legalName"
          ></c-button-secondary>
        </router-link>
      </li>
      <c-button-primary
        v-if="isLoadMoreShown"
        class="self-start mt-5"
        @click="$store.dispatch('businessModule/fetchBusinessPages')" :text="$t('loadMore')">
      </c-button-primary>
    </ul>
  </div>
</template>

<script>
import CButtonPrimary from "@/components/common/CButtonPrimary";
import CButtonSecondary from "@/components/common/CButtonSecondary";

export default {
  name: "businessPages",
  components: {
    CButtonSecondary,
    CButtonPrimary
  },
  computed: {
    isLoadMoreShown() {
      return this.$store.state.businessModule.totalBusinessPagesPagesOnServer > this.$store.state.businessModule.businessPagesCurrentPage + 1;
    }
  },
  created() {
    if (!this.$store.state.businessModule.businessPages.length)
      this.$store.dispatch("businessModule/fetchBusinessPages");
  }
};
</script>

<style scoped></style>
