<template>
  <div class="flex flex-col gap-y-10" v-if="$store.state.businessManagementToolModule.businessApplication">
    <edit-business-page-general-business-information
      ref="editBusinessPageGeneralBusinessInformation"
      :is-disabled="currentStep < 1"
      :is-edit-mode="currentStep === 1"
      @stepHeaderClicked="currentStep > 1 ? (currentStep = 1) : {}"
      @nextStepClicked="currentStep = 2"
    ></edit-business-page-general-business-information>
    <edit-business-page-legal-business-information
      :is-create="isCreate"
      ref="editBusinessPageLegalBusinessInformation"
      :is-disabled="currentStep < 2"
      :is-edit-mode="currentStep === 2"
      @stepHeaderClicked="currentStep > 2 ? (currentStep = 2) : {}"
      @nextStepClicked="currentStep = 3"
      @previousStepClicked="currentStep = 1"
    ></edit-business-page-legal-business-information>
    <edit-business-page-payment-details
      ref="editBusinessPagePaymentDetails"
      :is-disabled="currentStep < 3"
      :is-edit-mode="currentStep === 3"
      @stepHeaderClicked="currentStep > 3 ? (currentStep = 3) : {}"
      @nextStepClicked="submitCreateBusinessPageForm()"
      @previousStepClicked="currentStep = 2"
    ></edit-business-page-payment-details>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EditBusinessPageGeneralBusinessInformation
  from "@/components/edit_business_page_view/EditBusinessPageGeneralBusinessInformation.vue";
import EditBusinessPageLegalBusinessInformation
  from "@/components/edit_business_page_view/EditBusinessPageLegalBusinessInformation.vue";
import EditBusinessPagePaymentDetails from "@/components/edit_business_page_view/EditBusinessPagePaymentDetails.vue";
import {
  BusinessContacts,
  BusinessDescription,
  BusinessLegalDocuments,
  BusinessLogo,
  BusinessPaymentDetails,
  CreateBusinessApplicationRequest,
  UpdateBusinessApplicationRequest
} from "@/generated-sources/openapi";

export default Vue.extend({
  name: "EditBusinessPage",
  components: {
    EditBusinessPageGeneralBusinessInformation,
    EditBusinessPageLegalBusinessInformation,
    EditBusinessPagePaymentDetails
  },
  props: {
    isCreate: {
      type: Boolean
    }
  },
  created() {
    if (this.isCreate)
      this.$store.commit("businessManagementToolModule/setDefaultBusinessApplicationProperties");
  },
  data() {
    return {
      currentStep: 1
    };
  },
  methods: {
    submitCreateBusinessPageForm() {
      let businessDescription: BusinessDescription = {
        legalName:
        this.$refs.editBusinessPageGeneralBusinessInformation.companyName,
        businessEntityType: this.$refs.editBusinessPageLegalBusinessInformation.businessEntityType,
        uniqueIdentificationCode:
        this.$refs.editBusinessPageLegalBusinessInformation
          .identificationCode,
        tvaNumber:
        this.$refs.editBusinessPageLegalBusinessInformation.tvaCode,
        companyDescription:
        this.$refs.editBusinessPageGeneralBusinessInformation.description
      };
      let businessPaymentDetails: BusinessPaymentDetails = {
        iban: this.$refs.editBusinessPagePaymentDetails.iban,
        bank: this.$refs.editBusinessPagePaymentDetails.bankName,
        swiftCode: this.$refs.editBusinessPagePaymentDetails.swiftCode
      };
      let businessLegalDocuments: BusinessLegalDocuments = {
        registrationCertificateKey:
        this.$refs.editBusinessPageLegalBusinessInformation
          .registrationCertificateKey,
        registrationCertificateFileUrl:
        this.$refs.editBusinessPageLegalBusinessInformation
          .registrationCertificateFileUrl,
        bankStatementFileKey:
        this.$refs.editBusinessPageLegalBusinessInformation
          .bankStatementFileKey,
        bankStatementFileUrl:
        this.$refs.editBusinessPageLegalBusinessInformation
          .bankStatementFileUrl
      };
      let businessContacts: BusinessContacts = {
        phoneNumber:
        this.$refs.editBusinessPageGeneralBusinessInformation.phoneNumber,
        email:
        this.$refs.editBusinessPageGeneralBusinessInformation.companyEmail,
        address:
        this.$refs.editBusinessPageGeneralBusinessInformation.address,
        website:
        this.$refs.editBusinessPageGeneralBusinessInformation.websiteUrl,
        facebook:
        this.$refs.editBusinessPageGeneralBusinessInformation.facebookUrl,
        instagram:
        this.$refs.editBusinessPageGeneralBusinessInformation.instagramUrl
      };
      let businessLogo: BusinessLogo = {
        logoKey:
        this.$refs.editBusinessPageGeneralBusinessInformation.logoKey,
        logoFileUrl:
        this.$refs.editBusinessPageGeneralBusinessInformation.logoFileUrl
      };

      // {"businessDescription":{"legalName":"dsa","businessEntityType":"SNC","uniqueIdentificationCode":"321","tvaNumber":"321","companyDescription":null},"businessPaymentDetails":{"iban":"MD21EX000000000001234567","bank":"dsa","swiftCode":"AGRNMD2X"},"businessLegalDocuments":{"registrationCertificateKey":"business/kek1@gmail.com/legalDocuments/registrationCertificate.pdf","registrationCertificateFileUrl":"https://marketplace-storage-test.s3.eu-north-1.amazonaws.com/business/kek1%40gmail.com/legalDocuments/registrationCertificate.pdf","bankStatementFileKey":"business/kek1@gmail.com/legalDocuments/bankStatement.pdf","bankStatementFileUrl":"https://marketplace-storage-test.s3.eu-north-1.amazonaws.com/business/kek1%40gmail.com/legalDocuments/bankStatement.pdf"},"businessContacts":{"phoneNumber":"079292252","email":"sda@gmail.com","address":"dsa","website":null,"facebook":null,"instagram":null},"businessLogo":{"logoKey":"business/kek1@gmail.com/logo/registrationCertificate.png","logoFileUrl":"https://marketplace-storage-test.s3.eu-north-1.amazonaws.com/business/kek1%40gmail.com/logo/registrationCertificate.png"}}
      if (this.isCreate) {
        let createBusinessApplicationRequest: CreateBusinessApplicationRequest = {
          businessDescription: businessDescription,
          businessPaymentDetails: businessPaymentDetails,
          businessLegalDocuments: businessLegalDocuments,
          businessContacts: businessContacts,
          businessLogo: businessLogo
        };
        this.$store.dispatch("eventModule/showLoadingOverlay");
        this.$store
          .dispatch("businessManagementToolModule/createBusinessApplication", createBusinessApplicationRequest)
          .then(() => {
            this.$keycloak.login({
              redirectUri: process.env.VUE_APP_URL + "/business-management-tool/edit-business-page"
            });
            // this.$keycloak.updateToken(3000)
            //   .finally(() => {
            //     this.$router.push({ name: "businessManagementToolEditBusinessPage" });
            //   });
          })
          .catch(() => {
            this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$tc("somethingWentWrong"),
              type: "error"
            });
          })
          .finally(() => this.$store.dispatch("eventModule/hideLoadingOverlay"));
      } else {
        let updateBusinessApplicationRequest: UpdateBusinessApplicationRequest = {
          businessDescription: businessDescription,
          businessPaymentDetails: businessPaymentDetails,
          businessLegalDocuments: businessLegalDocuments,
          businessContacts: businessContacts,
          businessLogo: businessLogo,
          id: this.$store.state.businessManagementToolModule.businessApplication.id
        };

        this.$store.dispatch("eventModule/showLoadingOverlay");
        this.$store
          .dispatch("businessManagementToolModule/updateBusinessApplication", updateBusinessApplicationRequest)
          .then(() => {
            this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$t("newReviewRequestHasBeenSent")
            });
            this.currentStep = 1;
          })
          .catch(() => {
            this.$store.dispatch("eventModule/showSnackbar", {
              message: this.$tc("somethingWentWrong"),
              type: "error"
            });
          })
          .finally(() => this.$store.dispatch("eventModule/hideLoadingOverlay"));
      }
    }
  }
});
</script>

<style scoped>

</style>