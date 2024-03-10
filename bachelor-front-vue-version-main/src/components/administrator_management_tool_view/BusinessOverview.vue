<template>
  <div class="flex flex-col">
    <h4 class="mt-8">{{ $t("generalBusinessInformation") }}</h4>
    <table class="mt-4">
      <tbody>
      <tr>
        <td class="sm:w-[30%]"><p>{{ $t("companyName") }}</p></td>
        <td><span class="label block">{{ business.businessDescription.legalName }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("aboutTheCompany") }}</p></td>
        <td>
          <p v-if="business.businessDescription.companyDescription" class="text-cinder">
            {{ business.businessDescription.companyDescription }}</p>
          <p v-else class="italic c-text-12">{{ $t("emptyWithBraces") }}</p>
        </td>
      </tr>
      <tr>
        <td><p>{{ $t("companyAddress") }}</p></td>
        <td><a :href="'https://maps.google.com/?q=' + business.businessContacts.address" target="_blank">
          <c-button-secondary
            class="text-start"
            size="medium"
            :text="business.businessContacts.address"
          ></c-button-secondary>
        </a></td>
      </tr>
      <tr>
        <td><p>{{ $t("phoneNumber") }}</p></td>
        <td><a :href="'tel:' + business.businessContacts.phoneNumber">
          <c-button-secondary :text="business.businessContacts.phoneNumber.toString()" class="text-start"
                              size="medium"></c-button-secondary>
        </a></td>
      </tr>
      <tr>
        <td><p>{{ $t("companyEmail") }}</p></td>
        <td>
          <a :href="'mailto:' + business.businessContacts.email">
            <c-button-secondary
              class="text-start"
              size="medium"
              :text="business.businessContacts.email"
            ></c-button-secondary>
          </a>
        </td>
      </tr>
      <tr>
        <td><p>{{ $t("companyLogo") }}</p></td>
        <td>
          <img
            :src="business.businessLogo?.logoFileUrl ?? require('@/assets/images/image_failed_to_load.svg')"
            @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
            alt="companyLogo"
            class="w-[144px] object-cover rounded-lg aspect-square"
          />
        </td>
      </tr>
      <tr>
        <td><p>{{ $t("companyWebsite") }}</p></td>
        <td>
          <a v-if="business.businessContacts.website" :href="business.businessContacts.website" target="_blank">
            <c-button-secondary
              class="text-start"
              size="medium"
              :text="business.businessContacts.website"
            ></c-button-secondary>
          </a>
          <p v-else class="italic c-text-12">{{ $t("emptyWithBraces") }}</p>
        </td>
      </tr>
      <tr>
        <td><p>Facebook</p></td>
        <td>
          <a v-if="business.businessContacts.facebook" :href="business.businessContacts.facebook" target="_blank">
            <c-button-secondary
              class="text-start"
              size="medium"
              :text="business.businessContacts.facebook"
            ></c-button-secondary>
          </a>
          <p v-else class="italic c-text-12">{{ $t("emptyWithBraces") }}</p>
        </td>
      </tr>
      <tr>
        <td><p>Instagram</p></td>
        <td>
          <a v-if="business.businessContacts.instagram" :href="business.businessContacts.instagram" target="_blank">
            <c-button-secondary
              class="text-start"
              size="medium"
              :text="business.businessContacts.instagram"
            ></c-button-secondary>
          </a>
          <p v-else class="italic c-text-12">{{ $t("emptyWithBraces") }}</p>
        </td>
      </tr>
      </tbody>
    </table>
    <h4 class="mt-8">{{ $t("legalBusinessInformation") }}</h4>
    <table class="mt-4">
      <tbody>
      <tr>
        <td class="sm:w-[30%]"><p>{{ $t("identificationCode") }}</p></td>
        <td><span class="label block">{{ business.businessDescription.uniqueIdentificationCode }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("tvaCode") }}</p></td>
        <td><span class="label block">{{ business.businessDescription.tvaNumber }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("businessEntityType") }}</p></td>
        <td><span class="label block">{{ business.businessDescription.businessEntityType }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("registrationCertificate") }}</p></td>
        <td>
          <c-button-secondary
            @click="handleDownloadRegistrationCertificate()"
            class="text-start"
            size="medium"
            :text="$t('downloadFile')"
            icon-end="fa-solid fa-download"
          ></c-button-secondary>
        </td>
      </tr>
      <tr>
        <td><p>{{ $t("bankStatement") }}</p></td>
        <td>
          <c-button-secondary
            @click="handleDownloadBankStatement()"
            class="text-start"
            size="medium"
            :text="$t('downloadFile')"
            icon-end="fa-solid fa-download"
          ></c-button-secondary>
        </td>
      </tr>
      </tbody>
    </table>
    <h4 class="mt-8">{{ $t("paymentDetails") }}</h4>
    <table class="mt-4">
      <tbody>
      <tr>
        <td class="sm:w-[30%]"><p>{{ $t("ibanNumber") }}</p></td>
        <td><span class="label block">{{ business.businessPaymentDetails.iban }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("bankName") }}</p></td>
        <td><span class="label block">{{ business.businessPaymentDetails.bank }}</span></td>
      </tr>
      <tr>
        <td><p>{{ $t("swiftCode") }}</p></td>
        <td><span class="label block">{{ business.businessPaymentDetails.swiftCode }}</span></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import CButtonSecondary from "@/components/common/CButtonSecondary";
import filesManipulationMixin from "@/util/filesManipulationMixin";

export default {
  name: "BusinessOverview",
  components: {
    CButtonSecondary
  },
  mixins: [filesManipulationMixin],
  props: {
    business: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleDownloadRegistrationCertificate() {
      this.$store.dispatch("administratorManagementToolModule/downloadLegalDocument",
        btoa(this.business.businessLegalDocuments.registrationCertificateKey))
        .then((response) => {
          this.downloadFile(this.business.businessDescription.legalName + " - " + this.$t("registrationCertificate") + ".pdf",
            response.data,
            "application/pdf");
        });
    },
    handleDownloadBankStatement() {
      this.$store.dispatch("administratorManagementToolModule/downloadLegalDocument",
        btoa(this.business.businessLegalDocuments.bankStatementFileKey))
        .then((response) => {
          this.downloadFile(this.business.businessDescription.legalName + " - " + this.$t("bankStatement") + ".pdf",
            response.data,
            "application/pdf");
        });
    }
  }
};
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