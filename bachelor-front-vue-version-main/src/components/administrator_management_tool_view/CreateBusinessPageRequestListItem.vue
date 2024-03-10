<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <span class="truncate c-text-14">{{ request.businessDescription.legalName }}</span>
    <c-button-secondary @click="isDialogShown = true" :text="$t('review')"></c-button-secondary>
    <c-dialog width="736" v-model="isDialogShown">
      <template #title>
        <h3>{{ $t("createBusinessPageRequest") }}</h3>
      </template>
      <template #body>
        <business-overview :business="request"></business-overview>
      </template>
      <template #footer>
        <div class="mt-3 flex items-center justify-end">
          <c-button-secondary class="mr-6" @click="isDialogShown = false" :text="$t('cancel')"></c-button-secondary>
          <c-button-primary class="mr-3" @click="handleAccept()" :text="$t('accept')"></c-button-primary>
          <c-button-primary @click="handleDecline()" :text="$t('decline')"></c-button-primary>
        </div>
      </template>
    </c-dialog>
    <c-dialog v-model="isSecondaryDialogShown" :title-text="$t('declineApplication')"
              @confirm="handleDeclineConfirmed()">
      <template #body>
        <c-textarea size="small" v-model="declineReason" class="mt-4"
                    :placeholder="$t('pleaseSpecifyWhatIsWrongWithTheApplication')"></c-textarea>
      </template>
    </c-dialog>
  </div>
</template>

<script lang="ts">
import CDialog from "@/components/common/CDialog.vue";
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import CTextarea from "@/components/common/CTextarea.vue";
import BusinessOverview from "@/components/administrator_management_tool_view/BusinessOverview.vue";
import Vue from "vue";
import { BusinessReviewState, CreateBusinessReviewRequest } from "@/generated-sources/openapi";

export default Vue.extend({
  name: "CreateBusinessPageRequest",
  components: {
    CDialog,
    CButtonSecondary,
    CButtonPrimary,
    CTextarea,
    BusinessOverview
  },
  props: {
    request: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDialogShown: false,
      isSecondaryDialogShown: false,

      declineReason: null
    };
  },
  methods: {
    handleAccept() {
      let createBusinessReviewRequest: CreateBusinessReviewRequest = {
        businessApplicationId: this.request.id,
        businessReviewState: BusinessReviewState.Approved
      };
      this.$store.dispatch("administratorManagementToolModule/createBusinessApplicationReview", createBusinessReviewRequest)
        .then(() => {
          this.isDialogShown = false;
          this.$store.dispatch("administratorManagementToolModule/fetchCreateBusinessPageRequests", 1);
        });
    },
    handleDecline() {
      this.isSecondaryDialogShown = true;
    },
    handleDeclineConfirmed() {
      let createBusinessReviewRequest: CreateBusinessReviewRequest = {
        businessApplicationId: this.request.id,
        businessReviewState: BusinessReviewState.Denied,
        businessReviewDescription: this.declineReason
      };
      this.$store.dispatch("administratorManagementToolModule/createBusinessApplicationReview", createBusinessReviewRequest)
        .then(() => {
          this.isSecondaryDialogShown = false;
          this.isDialogShown = false;
          this.$store.dispatch("administratorManagementToolModule/fetchCreateBusinessPageRequests", 1);
        });
    }
  }
});
</script>

<style scoped>

</style>