<template>
  <edit-business-page-step-template
    @stepHeaderClicked="$emit('stepHeaderClicked')"
    @nextStepClicked="handleNextStepClicked"
    @previousStepClicked="$emit('previousStepClicked')"
    :step-title="$t('legalBusinessInformation')"
    :step-number="2"
    :is-edit-mode="isEditMode"
    :is-disabled="isDisabled"
  >
    <c-input
      ref="cInputIdentificationCode"
      v-model="identificationCode"
      size="medium"
      :label-text="$t('identificationCode') + ' *'"
      :validator-functions="[validateRequired, validateIsInteger]"
    ></c-input>
    <c-input
      class="mt-8"
      ref="cInputTvaCode"
      v-model="tvaCode"
      size="medium"
      :label-text="$t('tvaCode') + ' *'"
      :validator-functions="[validateRequired, validateIsInteger]"
    ></c-input>
    <span class="block c-text-14 mt-8 mb-2">
      {{ $t("businessEntityType") + " *" }}
    </span>
    <div class="inline-block">
      <c-menu
        is-radio
        :items="[
          {
            name: 'SRL',
            selected: businessEntityType === 'SRL',
            function: () => (businessEntityType = 'SRL'),
          },
          {
            name: 'SNC',
            selected: businessEntityType === 'SNC',
            function: () => (businessEntityType = 'SNC'),
          },
          {
            name: 'SC',
            selected: businessEntityType === 'SC',
            function: () => (businessEntityType = 'SC'),
          },
          {
            name: 'SA',
            selected: businessEntityType === 'SA',
            function: () => (businessEntityType = 'SA'),
          },
        ]"
      >
        <template #activator>
          <c-button-primary
            type="button"
            :text="businessEntityType"
            icon-end="fa-solid fa-chevron-down"
          ></c-button-primary>
        </template>
      </c-menu>
    </div>
    <c-info
      style="max-width: calc(96px * 4)"
      v-if="isCreate"
      class="mt-10"
      :text="$t('theFilesBelowHaveToBeInPdfFormat')"
    ></c-info>
    <c-info
      style="max-width: calc(96px * 4)"
      v-else
      class="mt-10"
      :text="$t('theFilesBelowHaveToBeInPdfFormat') + '\n' + $t('pleaseBeAwareThatIfYouNeedToReUploadOneFileYouWillHaveTo').toUpperCase()"
    ></c-info>
    <c-file-input
      :non-native-file-name="registrationCertificateKey ? $t('somePdfUploaded') : ''"
      accept="application/pdf"
      class="mt-8"
      :label-text="$t('registrationCertificate') + ' *'"
      @fileSelected="registrationCertificateSelected"
      ref="cFileInputRegistrationCertificate"
    ></c-file-input>
    <c-file-input
      :non-native-file-name="bankStatementFileKey ? $t('somePdfUploaded') : ''"
      accept="application/pdf"
      class="mt-8"
      :label-text="$t('bankStatement') + ' *'"
      ref="cFileInputBankStatement"
      @fileSelected="bankStatementSelected"
    ></c-file-input>
  </edit-business-page-step-template>
</template>

<script lang="ts">
import EditBusinessPageStepTemplate from "@/components/edit_business_page_view/EditBusinessPageStepTemplate.vue";
import CInput from "@/components/common/CInput.vue";
import validatorMixin from "@/util/validatorMixin";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import CMenu from "@/components/common/CMenu.vue";
import CInfo from "@/components/common/CInfo.vue";
import CFileInput from "@/components/common/CFileInput.vue";
import Vue from "vue";

export default Vue.extend({
  //https://www.legis.md/cautare/getResults?doc_id=109311&lang=ro
  //interpr indiv, cooperative ...
  name: "EditBusinessPageLegalBusinessInformation",
  components: {
    EditBusinessPageStepTemplate,
    CInput,
    CButtonPrimary,
    CMenu,
    CInfo,
    CFileInput
  },
  mixins: [validatorMixin],
  props: {
    isDisabled: {
      type: Boolean
    },
    isEditMode: {
      type: Boolean
    },
    isCreate: {
      type: Boolean
    }
  },
  computed: {
    identificationCode: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessDescription.uniqueIdentificationCode?.toString();
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationUniqueIdentificationCode", value);
      }
    },
    tvaCode: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessDescription.tvaNumber?.toString();
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationTvaNumber", value);
      }
    },
    businessEntityType: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessDescription.businessEntityType;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationBusinessEntityType", value);
      }
    },
    registrationCertificateKey: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessLegalDocuments.registrationCertificateKey;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationRegistrationCertificateKey", value);
      }
    },
    registrationCertificateFileUrl: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessLegalDocuments.registrationCertificateFileUrl;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationRegistrationCertificateFileUrl", value);
      }
    },
    bankStatementFileKey: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessLegalDocuments.bankStatementFileKey;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationBankStatementFileKey", value);
      }
    },
    bankStatementFileUrl: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessLegalDocuments.bankStatementFileUrl;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationBankStatementFileUrl", value);
      }
    }
  },
  data() {
    return {
      tempRegistrationCertificateFile: null,
      tempBankStatementFile: null
    };
  },
  methods: {
    registrationCertificateSelected(registrationCertificate) {
      this.tempRegistrationCertificateFile = registrationCertificate;
      if (this.tempBankStatementFile) this.uploadLegalDocumentsLocal();
    },
    bankStatementSelected(bankStatement) {
      this.tempBankStatementFile = bankStatement;
      if (this.tempRegistrationCertificateFile)
        this.uploadLegalDocumentsLocal();
    },
    uploadLegalDocumentsLocal() {
      this.$store.dispatch("eventModule/showLoadingOverlay", {
        isInstant: true
      });
      this.$store
        .dispatch("businessManagementToolModule/uploadLegalDocuments", {
          registrationCertificate: this.tempRegistrationCertificateFile,
          bankStatement: this.tempBankStatementFile
        })
        .then((response) => {
          this.registrationCertificateKey =
            response.data.registrationCertificateKey;
          this.registrationCertificateFileUrl =
            response.data.registrationCertificateFileUrl;
          this.bankStatementFileKey = response.data.bankStatementFileKey;
          this.bankStatementFileUrl = response.data.bankStatementFileUrl;
        })
        .catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$tc("somethingWentWrongWhileUploadingTheFile", 2),
            type: "error"
          });
          this.$refs.cFileInputRegistrationCertificate.reset();
          this.$refs.cFileInputBankStatement.reset();
          this.tempRegistrationCertificateFile = null;
          this.tempBankStatementFile = null;
          this.$refs.cFileInputRegistrationCertificate.validateInput();
          this.$refs.cFileInputBankStatement.validateInput();
        })
        .finally(() => this.$store.dispatch("eventModule/hideLoadingOverlay"));
    },
    validateLegalDocuments() {
      if (
        this.registrationCertificateKey &&
        this.registrationCertificateFileUrl &&
        this.bankStatementFileKey &&
        this.bankStatementFileUrl
      ) {
        return true;
      } else {
        if (!this.tempRegistrationCertificateFile) {
          this.$refs.cFileInputRegistrationCertificate.reset();
          this.$refs.cFileInputRegistrationCertificate.validateInput();
        }
        if (!this.tempBankStatementFile) {
          this.$refs.cFileInputBankStatement.reset();
          this.$refs.cFileInputBankStatement.validateInput();
        }
        return false;
      }
    },
    handleNextStepClicked() {
      let isIdentificationCodeValid =
        this.$refs.cInputIdentificationCode.validateInput();
      let isTvaCodeValid = this.$refs.cInputTvaCode.validateInput();
      let isLegalDocumentsValid = this.validateLegalDocuments();

      if (isIdentificationCodeValid && isTvaCodeValid && isLegalDocumentsValid)
        this.$emit("nextStepClicked");
    }
  }
});
</script>

<style scoped></style>
