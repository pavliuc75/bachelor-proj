<template>
  <edit-business-page-step-template
    @stepHeaderClicked="$emit('stepHeaderClicked')"
    @nextStepClicked="handleNextStepClicked"
    @previousStepClicked="$emit('previousStepClicked')"
    :step-title="$t('paymentDetails')"
    :step-number="3"
    :is-edit-mode="isEditMode"
    :is-disabled="isDisabled"
  >
    <vc-input
      ref="cInputIban"
      v-model="iban"
      size="medium"
      :label-text="$t('ibanNumber') + ' *'"
      :validator-functions="[validateRequired, validateIsIban]"
      :placeholder="$t('exampleIban')"
    ></vc-input>
    <c-input
      ref="cInputBankName"
      v-model="bankName"
      size="medium"
      class="mt-8"
      :label-text="$t('bankName') + ' *'"
      :validator-functions="[validateRequired]"
    ></c-input>
    <c-input
      ref="cInputSwiftCode"
      v-model="swiftCode"
      size="medium"
      class="mt-8"
      :label-text="$t('swiftCode') + ' *'"
      :placeholder="$t('exampleSwiftCode')"
      :validator-functions="[validateRequired, validateSwiftCode]"
    ></c-input>
  </edit-business-page-step-template>
</template>

<script>
import EditBusinessPageStepTemplate from "@/components/edit_business_page_view/EditBusinessPageStepTemplate";
import CInput from "@/components/common/CInput";
import validatorMixin from "@/util/validatorMixin";

export default {
  name: "EditBusinessPagePaymentDetails",
  components: {
    EditBusinessPageStepTemplate,
    CInput
  },
  mixins: [validatorMixin],
  props: {
    isDisabled: {
      type: Boolean
    },
    isEditMode: {
      type: Boolean
    }
  },
  computed: {
    iban: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessPaymentDetails.iban;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationIban", value);
      }
    },
    swiftCode: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessPaymentDetails.swiftCode;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationSwiftCode", value);
      }
    },
    bankName: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessPaymentDetails.bank;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationBank", value);
      }
    }
  },
  methods: {
    handleNextStepClicked() {
      let isIbanValid = this.$refs.cInputIban.validateInput();
      let isBankNameValid = this.$refs.cInputBankName.validateInput();
      let isSwiftCodeValid = this.$refs.cInputSwiftCode.validateInput();

      if (isIbanValid && isBankNameValid && isSwiftCodeValid)
        this.$emit("nextStepClicked");
    }
  }
};
</script>

<style scoped></style>
