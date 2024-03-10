<template>
  <div class="flex flex-col grow"
       v-if="$store.state.businessModule.businessPage?.id === $route.params.businessPageId">
    <div class="container flex self-center">
      <c-path-representation
        class="mt-3"
        :directories="[
          {
            route: { path: '/business-pages' },
            name: $t('allCompanies'),
          }, { name: $store.state.businessModule.businessPage.businessDescription.legalName },
        ]"
      ></c-path-representation>
    </div>
    <div class="border-b border-mid-gray border-solid mt-3"></div>
    <div class="container flex self-center flex-col my-16">
      <img
        :src="$store.state.businessModule.businessPage?.businessLogo?.logoFileUrl"
        @error="(e) => e.target.src = require('@/assets/images/image_failed_to_load.svg')"
        alt=""
        class="w-[144px] object-cover rounded-lg aspect-square"
      />
      <h1 class="mt-10" data-cy="company-header">{{ $store.state.businessModule.businessPage.businessDescription.legalName }}</h1>
    </div>
    <div class="container flex self-center flex-col sm:flex-row mb-20 gap-x-20 gap-y-16">
      <div class="flex basis-2/3 flex-col">
        <h4 v-if="$store.state.businessModule.businessPage.businessDescription.companyDescription" class="mb-4">
          {{ $t("aboutTheCompany") }}</h4>
        <p class="mb-16" v-if="$store.state.businessModule.businessPage.businessDescription.companyDescription">
          {{ $store.state.businessModule.businessPage.businessDescription.companyDescription }}
        </p>
        <h4 v-if="$store.state.businessModule.businessPage.businessContacts?.website ||
                  $store.state.businessModule.businessPage.businessContacts?.facebook ||
                  $store.state.businessModule.businessPage.businessContacts?.instagram" class="mb-4">
          {{ $t("socialMedia")
          }}</h4>
        <ul v-if="$store.state.businessModule.businessPage.businessContacts?.website ||
                  $store.state.businessModule.businessPage.businessContacts?.facebook ||
                  $store.state.businessModule.businessPage.businessContacts?.instagram"
            class="mb-16 flex flex-col self-start gap-2">
          <li v-if="$store.state.businessModule.businessPage.businessContacts?.website">
            <a :href="$store.state.businessModule.businessPage.businessContacts.website" target="_blank">
              <c-button-secondary size="medium" :text="$t('website')"></c-button-secondary>
            </a>
          </li>
          <li v-if="$store.state.businessModule.businessPage.businessContacts?.instagram">
            <a :href="$store.state.businessModule.businessPage.businessContacts.instagram" target="_blank">
              <c-button-secondary size="medium" text="Instagram"></c-button-secondary>
            </a>
          </li>
          <li v-if="$store.state.businessModule.businessPage.businessContacts?.facebook">
            <a :href="$store.state.businessModule.businessPage.businessContacts.facebook" target="_blank">
              <c-button-secondary size="medium" text="Facebook"></c-button-secondary>
            </a>
          </li>
        </ul>
        <h4 class="mb-4">{{ $t("contact") }}</h4>
        <div class="flex flex-start">
          <table>
            <tbody>
            <tr>
              <td>
                <p>{{ $t("phoneNumber") }}</p>
              </td>
              <td>
                <a :href="'tel:' + '0'+$store.state.businessModule.businessPage.businessContacts?.phoneNumber">
                  <c-button-secondary :text="'0'+$store.state.businessModule.businessPage.businessContacts?.phoneNumber"
                                      size="medium"></c-button-secondary>
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <p>{{ $t("email") }}</p>
              </td>
              <td>
                <a :href="'mailto:' + $store.state.businessModule.businessPage.businessContacts?.email">
                  <c-button-secondary size="medium"
                                      :text="$store.state.businessModule.businessPage.businessContacts?.email"></c-button-secondary>
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <p>{{ $t("address") }}</p>
              </td>
              <td>
                <a
                  :href="'https://maps.google.com/?q=' +$store.state.businessModule.businessPage.businessContacts?.address"
                  target="_blank">
                  <c-button-secondary class="text-start" size="medium"
                                      :text="$store.state.businessModule.businessPage.businessContacts?.address"></c-button-secondary>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex flex-col basis-1/3" v-if="$store.state.businessModule.businessAnalytics">
        <h4 class="mb-4">{{ $t("details") }}</h4>
        <ul class="flex flex-col gap-2">
          <li v-if="$store.state.businessModule.businessPage.createdDate">
            <p>
              {{ $t("joined") }}
              {{
                getDatePartOfDateAsString(
                  $store.state.businessModule.businessPage.createdDate
                )
              }}
            </p>
          </li>
          <li>
            <p>
              {{
                $t("soldNProductsInTotal", {
                  n: $store.state.businessModule.businessAnalytics.soldProductsTotal
                })
              }}
            </p>
          </li>
          <li>
            <p>
              {{ $t("averageProductRatingIs") }}
              {{ $store.state.businessModule.businessAnalytics.averageProductRating }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="container self-center mb-8">
      <h3>{{ $t("companyProducts") }}</h3>
    </div>
    <div class="border-b border-solid border-mid-gray"></div>
    <products-grid
      class="mb-16"
      :is-toolbar-shown="false"
      @loadMore="$store.dispatch('businessModule/fetchBusinessProducts')"
      :products="$store.state.businessModule.businessProducts"
      :loading="$store.state.businessModule.isBusinessProductsLoading"
      :products-in-total="$store.state.businessModule.totalBusinessProductsOnServer">
      <template #pathRepresentation>
        <div></div>
      </template>
    </products-grid>
  </div>
</template>

<script>
import CPathRepresentation from "@/components/common/CPathRepresentation";
import CButtonSecondary from "@/components/common/CButtonSecondary";
import dateFormatterMixin from "@/util/dateFormatterMixin";
import ProductsGrid from "@/components/products_grid/ProductsGrid";

export default {
  //todo: add business details
  name: "BusinessPageView",
  components: {
    CButtonSecondary,
    CPathRepresentation,
    ProductsGrid
  },
  mixins: [dateFormatterMixin],
  watch: {
    "$route.params.businessPageId"() {
      this.doOnCreate();
    }
  },
  created() {
    this.doOnCreate();
  },
  methods: {
    doOnCreate() {
      if (this.$route.params.businessPageId !== this.$store.state.businessModule.businessPage?.id) {
        let businessPageFromBusinessPages = this.$store.state.businessModule.businessPages.find(
          (businessPage) => businessPage.id === this.$route.params.businessPageId
        );
        if (businessPageFromBusinessPages) {
          this.$store.commit("businessModule/setBusinessPage", businessPageFromBusinessPages);
          this.fetchBusinessProductsIfNecessary();
        } else {
          this.$store.dispatch("businessModule/fetchBusinessPage", this.$route.params.businessPageId)
            .then(() => {
              this.fetchBusinessProductsIfNecessary();
            });
        }
      } else {
        this.fetchBusinessProductsIfNecessary();
      }
      this.fetchBusinessAnalyticsIfNecessary();
    },
    fetchBusinessProductsIfNecessary() {
      if (this.$store.state.businessModule.businessProducts
        .some(product => product.businessPageId === this.$store.state.businessModule.businessPage.id)) {
        return;
      }
      this.$store.dispatch("businessModule/fetchBusinessProducts", true);
    },
    fetchBusinessAnalyticsIfNecessary() {
      if (this.$store.state.businessModule.businessAnalytics?.businessId !== this.$route.params.businessPageId) {
        this.$store.dispatch("businessModule/fetchPublicBusinessAnalytics", this.$route.params.businessPageId);
      }
    },
    handleLoadMoreButtonClicked() {
      this.$store.dispatch("businessModule/fetchBusinessProducts", false);
    }
  }
};
</script>

<style scoped>
td p:first-child {
  @apply mr-10;
}

table td {
  border-top: 8px solid transparent;
  vertical-align: top;
}

table tr:first-child td {
  border-top: 0;
}
</style>
