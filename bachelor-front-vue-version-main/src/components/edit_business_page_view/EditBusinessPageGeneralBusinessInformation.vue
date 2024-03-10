<template>
  <edit-business-page-step-template
    @stepHeaderClicked="$emit('stepHeaderClicked')"
    :step-title="$t('generalBusinessInformation')"
    :step-number="1"
    :is-edit-mode="isEditMode"
    :is-disabled="isDisabled"
  >
    <form class="flex flex-col">
      <c-input
        ref="cInputCompanyName"
        v-model="companyName"
        size="medium"
        :label-text="$t('companyName') + ' *'"
        :descriptionText="$t('doNotIncludeBusinessEntityTypeInformationEtc')"
        :validator-functions="[validateRequired]"
      ></c-input>
      <c-textarea
        ref="cTextareaDescription"
        v-model="description"
        :label-text="$t('aboutTheCompany')"
        class="mt-8"
      ></c-textarea>
      <c-input
        ref="cInputAddress"
        v-model="address"
        size="medium"
        class="mt-8"
        :label-text="$t('companyAddress') + ' *'"
        :validator-functions="[validateRequired]"
      ></c-input>
      <c-input
        ref="cInputPhoneNumber"
        v-model="phoneNumber"
        size="medium"
        class="mt-8"
        :label-text="$t('phoneNumber') + ' *'"
        :placeholder="$t('examplePhoneNumber')"
        :validator-functions="[validateIsPhoneNumber, validateRequired]"
      ></c-input>
      <c-input
        ref="cInputCompanyEmail"
        v-model="companyEmail"
        size="medium"
        class="mt-8"
        :label-text="$t('companyEmail') + ' *'"
        :validator-functions="[validateEmailAddress, validateRequired]"
      ></c-input>
      <c-file-input
        :non-native-file-name="logoKey ? $t('someImageUploaded') : ''"
        accept="image/png, image/jpeg, image/jpg"
        class="mt-8"
        :label-text="$t('companyLogo') + ' *'"
        ref="cFileInputLogo"
        @fileSelected="handleFileSelected"
        :description-text="$t('theUpdatedFileHasToBeAnImage')"
      ></c-file-input>
      <c-input
        ref="cInputWebsiteUrl"
        v-model="websiteUrl"
        size="medium"
        class="mt-8"
        :label-text="$t('companyWebsite')"
        :placeholder="$t('exampleWebsiteUrl')"
      ></c-input>
      <c-input
        ref="cInputFacebookUrl"
        v-model="facebookUrl"
        size="medium"
        class="mt-8"
        label-text="Facebook"
        :placeholder="$t('exampleFacebookUrl')"
      ></c-input>
      <c-input
        ref="cInputInstagramUrl"
        v-model="instagramUrl"
        size="medium"
        class="mt-8"
        label-text="Instagram"
        :placeholder="$t('exampleInstagramUrl')"
      ></c-input>
    </form>
    <template #actionsEnd>
      <div class="flex flex-row items-center gap-x-8 mt-8 mb-6">
        <c-button-primary
          size="medium"
          :text="$t('continue')"
          @click="handleNextStepClicked()"
          icon-end="fa-solid fa-arrow-right"
        ></c-button-primary>
      </div>
    </template>
  </edit-business-page-step-template>
</template>

<script>
import EditBusinessPageStepTemplate from "@/components/edit_business_page_view/EditBusinessPageStepTemplate";
import CButtonPrimary from "@/components/common/CButtonPrimary";
import CInput from "@/components/common/CInput";
import validatorMixin from "@/util/validatorMixin";
import CTextarea from "@/components/common/CTextarea";
import CFileInput from "@/components/common/CFileInput";

export default {
  name: "EditBusinessPageGeneralBusinessInformation",
  components: {
    EditBusinessPageStepTemplate,
    CButtonPrimary,
    CInput,
    CTextarea,
    CFileInput
  },
  props: {
    isDisabled: {
      type: Boolean
    },
    isEditMode: {
      type: Boolean
    }
  },
  mixins: [validatorMixin],
  computed: {
    companyName: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessDescription.legalName;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationLegalName", value);
      }
    },
    description: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessDescription.companyDescription;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationCompanyDescription", value);
      }
    },
    address: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessContacts.address;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationAddress", value);
      }
    },
    websiteUrl: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessContacts.website;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationWebsite", value);
      }
    },
    facebookUrl: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessContacts.facebook;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationFacebook", value);
      }
    },
    instagramUrl: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessContacts.instagram;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationInstagram", value);
      }
    },
    phoneNumber: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessContacts.phoneNumber;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationPhoneNumber", value);
      }
    },
    logoKey: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessLogo.logoKey;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationLogoKey", value);
      }
    },
    logoFileUrl: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessLogo.logoFileUrl;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationLogoFileUrl", value);
      }
    },
    companyEmail: {
      get() {
        return this.$store.state.businessManagementToolModule.businessApplication.businessContacts.email;
      },
      set(value) {
        this.$store.commit("businessManagementToolModule/setBusinessApplicationEmail", value);
      }
    }
  },
  methods: {
    handleFileSelected(file) {
      this.$store
        .dispatch("businessManagementToolModule/uploadCompanyLogo", file)
        .catch(() => {
          this.$store.dispatch("eventModule/showSnackbar", {
            message: this.$tc("somethingWentWrongWhileUploadingTheFile"),
            type: "error"
          });
          this.$refs.cFileInputLogo.reset();
          this.$refs.cFileInputLogo.validateInput();
        });
    },
    validateLogo() {
      if (this.logoKey && this.logoFileUrl) {
        return true;
      } else {
        this.$refs.cFileInputLogo.reset();
        return this.$refs.cFileInputLogo.validateInput();
      }
    },
    handleNextStepClicked() {
      let isCompanyNameValid = this.$refs.cInputCompanyName.validateInput();
      let isAddressValid = this.$refs.cInputAddress.validateInput();
      let isPhoneNumberValid = this.$refs.cInputPhoneNumber.validateInput();
      let isCompanyEmailValid = this.$refs.cInputCompanyEmail.validateInput();
      let isLogoValid = this.validateLogo();

      if (
        isCompanyNameValid &&
        isAddressValid &&
        isPhoneNumberValid &&
        isCompanyEmailValid &&
        isLogoValid
      ) {
        this.$emit("nextStepClicked");
      }
    }
  }
};
</script>

<style scoped></style>
