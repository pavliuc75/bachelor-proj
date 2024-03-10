<template>
  <div class="flex flex-col grow">
    <h2>{{ $t("editBusinessPage") }}</h2>
    <c-info
      class="mt-3"
      v-if="$store.state.businessManagementToolModule.businessApplication?.businessApplicationState === 'InReview'"
      :text="$t('status') + ': ' + $t('theReviewIsStillProcessing')" type="warning"></c-info>
    <c-info
      class="mt-3 max-w-xl"
      v-if="$store.state.businessManagementToolModule.businessApplication?.businessApplicationState === 'Denied'"
      :text="$t('status') + ': ' + $t('yourRequestHasBeenDenied')
      + (($store.state.businessManagementToolModule.businessApplicationReview?.businessReviewDescription && '. Reason: ') || '')
      + ($store.state.businessManagementToolModule.businessApplicationReview?.businessReviewDescription || '')"
      type="error"></c-info>
    <edit-business-page class="mt-10"></edit-business-page>
  </div>
</template>

<script>
import EditBusinessPage from "@/components/edit_business_page_view/EditBusinessPage";
import CInfo from "@/components/common/CInfo";

export default {
  name: "AdministratorManagementToolViewEditBusinessPage",
  components: {
    EditBusinessPage,
    CInfo
  }
}
;
</script>

<style scoped></style>
