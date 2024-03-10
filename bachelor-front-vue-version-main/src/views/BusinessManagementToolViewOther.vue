<template>
  <div class="flex flex-col grow">
    <h2 class="mb-10">{{ $t("Other") }}</h2>
    <c-button-secondary
      data-cy="request-category-button"
      @click="handleOpenSendCreateCategoryRequestDialog"
      size="medium"
      :text="$t('requestANewCategory')"
      icon-end="fa-solid fa-arrow-up-right-from-square"
    ></c-button-secondary>
    <h3 v-if="$store.state.businessManagementToolModule.businessAnalytics" class="mt-10 mb-6">{{ $t("businessStats") }}</h3>
    <table v-if="$store.state.businessManagementToolModule.businessAnalytics" class="max-w-xs" data-cy="analytics-table">
      <tbody>
      <tr>
        <td><p>{{ $t("numberOfCompletedOrders") }}</p></td>
        <td><span class="label block">{{ $store.state.businessManagementToolModule.businessAnalytics.totalNumberOfCompletedOrders }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("numberOfIncompleteOrders") }}</p></td>
        <td><span class="label block">{{ $store.state.businessManagementToolModule.businessAnalytics.totalNumberOfOrdersToBeCompleted }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("ordersInTotal") }}</p></td>
        <td><span class="label block">{{ $store.state.businessManagementToolModule.businessAnalytics.totalIncome }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("productsSold") }}</p></td>
        <td><span class="label block">{{ $store.state.businessManagementToolModule.businessAnalytics.totalSoldAmountProducts  }}</span></td>
      </tr>
      </tbody>
    </table>
    <c-dialog @confirm="handleSendCreateCategoryRequest()"
              :title-text="$t('requestANewCategory')"
              :subtitle-text="$t('requestANewCategoryDescription')"
              v-model="isSendRequestDialogShown">
      <template #body>
        <c-input
          data-cy="request-category-input"
          class="mt-4"
          ref="cInputName"
          v-model="name"
          @keydown.enter="handleSendCreateCategoryRequest()"
          :label-text="$t('name') + ' *'"
          :validator-functions="[validateRequired, validateDoesNotAlreadyExist]"
        ></c-input>
      </template>
    </c-dialog>
  </div>
</template>

<script lang="ts">

import CButtonSecondary from "@/components/common/CButtonSecondary.vue";
import CDialog from "@/components/common/CDialog.vue";
import validatorMixin from "@/util/validatorMixin";
import CInput from "@/components/common/CInput.vue";
import Vue from "vue";
import { CreateCategoryApplicationRequest } from "@/generated-sources/openapi";

export default Vue.extend({
  name: "BusinessManagementToolViewOther",
  components: {
    CDialog,
    CButtonSecondary,
    CInput
  },
  mixins: [validatorMixin],
  data() {
    return {
      isSendRequestDialogShown: false,
      name: null
    };
  },
  created() {
    this.$store.dispatch("businessManagementToolModule/fetchBusinessAnalytics");
  },
  methods: {
    handleOpenSendCreateCategoryRequestDialog() {
      this.isSendRequestDialogShown = true;
      this.$store.dispatch("productModule/fetchCategories", true)
        .then(() => this.isSendRequestDialogShown = true);
    },
    validateDoesNotAlreadyExist(value) {
      let trimmedString = (value || "").trim().toLowerCase();
      let result = this.$store.state.productModule.categories.some(category => category.category === trimmedString);
      if (!value) {
        result = true;
      }
      return {
        isValid: !result,
        errorText: !result ? "" : this.$i18n.t("thisCategoryAlreadyExists")
      };
    },
    handleSendCreateCategoryRequest() {
      let isNameValid = this.$refs.cInputName.validateInput();
      if (isNameValid) {
        let createCategoryApplicationRequest: CreateCategoryApplicationRequest = {
          category: this.name.trim().toLowerCase()
        };
        this.$store.dispatch("businessManagementToolModule/sendCreateCategoryRequest", createCategoryApplicationRequest)
          .then(() => {
            this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$t("requestHasBeenSent")
            });
            this.isSendRequestDialogShown = false;
          })
          .catch(() => {
            this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$t("somethingWentWrong"),
              type: "error"
            });
          });
      }
    }
  }
});
</script>

<style scoped>
td p:first-child {
  @apply pr-10;
}

table td {
  border-top: 8px solid transparent;
  vertical-align: top;
}

table tr:first-child td {
  border-top: 0;
}
</style>