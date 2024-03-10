<template>
  <div class="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
    <span class="c-text-14 truncate">{{ category.category }}</span>
    <div class="flex items-center gap-x-3 flex-wrap">
      <c-button-secondary @click="handleAcceptCreateCategoryRequest()" :text="$t('accept')"></c-button-secondary>
      <c-button-secondary @click="isRejectCreateCategoryRequestDialogShown = true"
                          :text="$t('reject')"></c-button-secondary>
    </div>
    <c-dialog :title-text="$t('rejectNewCategoryRequest')"
              :subtitle-text="$t('doYouReallyWantToReject', {name: category.category})"
              v-model="isRejectCreateCategoryRequestDialogShown"
              @confirm="handleConfirmRejectCreateCategoryRequest()"></c-dialog>
  </div>
</template>

<script lang="ts">
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CDialog from "@/components/common/CDialog.vue";
import Vue from "vue";
import { CategoryApplicationResponse, HandleCategoryApplicationRequest } from "@/generated-sources/openapi";

export default Vue.extend({
  name: "CreateCategoryRequestListItem",
  components: {
    CButtonSecondary,
    CDialog
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isRejectCreateCategoryRequestDialogShown: false
    };
  },
  methods: {
    handleAcceptCreateCategoryRequest() {
      let handleCategoryApplicationRequest: HandleCategoryApplicationRequest = {
        categoryId: this.category.id,
        categoryState: CategoryApplicationResponse.Approve
      };
      this.$store.dispatch("administratorManagementToolModule/handleCreateCategoryRequest", handleCategoryApplicationRequest)
        .then(() => this.$store.dispatch("administratorManagementToolModule/fetchCreateCategoryRequests", 1))
        .catch(() => this.$store.dispatch("eventModule/showSnackbar", {
          message: this.$t("failedToApproveTheRequest"),
          type: "error"
        }));
    },
    handleConfirmRejectCreateCategoryRequest() {
      let handleCategoryApplicationRequest: HandleCategoryApplicationRequest = {
        categoryId: this.category.id,
        categoryState: CategoryApplicationResponse.Deny
      };
      this.$store.dispatch("administratorManagementToolModule/handleCreateCategoryRequest", handleCategoryApplicationRequest)
        .then(() => {
          this.isRejectCreateCategoryRequestDialogShown = false;
          this.$store.dispatch("administratorManagementToolModule/fetchCreateCategoryRequests", 1);
        })
        .catch(() => this.$store.dispatch("eventModule/showSnackbar", {
          message: this.$t("failedToRejectTheRequest"),
          type: "error"
        }));
    }
  }
});
</script>

<style scoped>

</style>