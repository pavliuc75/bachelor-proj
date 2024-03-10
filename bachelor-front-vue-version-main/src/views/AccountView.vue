<template>
  <div class="container flex self-center flex-col my-16">
    <div class="mb-8 flex flex-row justify-between">
      <h1>{{ $t("yourAccount") }}</h1>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <router-link
        data-cy="cart-button"
        to="/cart"
        class="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue"
      >
        <font-awesome-icon
          icon="fa-solid fa-cart-shopping"
          class="text-mid-gray self-start mb-3 account-button-icon"
        ></font-awesome-icon>
        <h4 class="mb-4">{{ $t("shoppingCart") }}</h4>
        <p>{{ $t("shoppingCartDescription") }}</p>
      </router-link>
      <router-link
        to="/favorites"
        class="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue"
      >
        <font-awesome-icon
          icon="fa-solid fa-heart"
          class="text-mid-gray self-start mb-3 account-button-icon"
        ></font-awesome-icon>
        <h4 class="mb-4">{{ $t("favoriteItems") }}</h4>
        <p>{{ $t("favoriteItemsDescription") }}</p>
      </router-link>
      <router-link
        data-cy="orders-button"
        to="/orders"
        class="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue"
      >
        <font-awesome-icon
          icon="fa-solid fa-clock-rotate-left"
          class="text-mid-gray self-start mb-3 account-button-icon"
        ></font-awesome-icon>
        <h4 class="mb-4">{{ $t("myOrders") }}</h4>
        <p>{{ $t("myOrdersDescription") }}</p>
      </router-link>
      <router-link
        to="/business-management-tool"
        v-if="isBusinessManagementToolShown() && !isAdministratorManagementToolShown()"
        class="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue"
      >
        <font-awesome-icon
          icon="fa-solid fa-briefcase"
          class="text-mid-gray self-start mb-3 account-button-icon"
        ></font-awesome-icon>
        <h4 class="mb-4">{{ $t("businessManagementTool") }}</h4>
        <p>{{ $t("businessManagementToolDescription") }}</p>
      </router-link>
      <router-link
        to="/administrator-management-tool"
        v-if="isAdministratorManagementToolShown()"
        class="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue"
      >
        <font-awesome-icon
          icon="fa-solid fa-solar-panel"
          class="text-mid-gray self-start mb-3 account-button-icon"
        ></font-awesome-icon>
        <h4 class="mb-4">{{ $t("administratorManagementTool") }}</h4>
        <p>{{ $t("administratorManagementToolDescription") }}</p>
      </router-link>
      <button
        v-if="!isAdministratorManagementToolShown()"
        @click="handleContactAdministrator()"
        type="button"
        data-cy="contact-administrator-button"
        class="items-start text-left account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue"
      >
        <font-awesome-icon
          icon="fa-solid fa-comments"
          class="text-mid-gray self-start mb-3 account-button-icon"
        ></font-awesome-icon>
        <h4 class="mb-4">{{ $t("contactAdministrator") }}</h4>
        <p>{{ $t("contactAdministratorDescription") }}</p>
      </button>
      <button
        data-cy="logout-button"
        @click="handleLogout()"
        type="button"
        class="items-start text-left account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue"
      >
        <font-awesome-icon
          icon="fa-solid fa-right-to-bracket"
          class="text-mid-gray self-start mb-3 account-button-icon"
        ></font-awesome-icon>
        <h4 class="mb-4">{{ $t("logout") }}</h4>
        <p>{{ $t("logoutDescription") }}</p>
      </button>
    </div>
      <div v-if="!isBusinessManagementToolShown()">
      <h4 class="mt-20">
        {{ $t("doYouWantToSellYourProductsOnOurPlatform") }}?
      </h4>
      <router-link to="/create-business-page" class="self-start">
        <c-button-primary
          class="self-start mt-4"
          :text="$t('createABusinessPage')"
        ></c-button-primary>
      </router-link>
    </div>
    <div class="flex flex-row justify-end gap-1 mt-16">
      <c-button-secondary :is-disabled="$i18n.locale === 'en'" @click="setLanguage('en')" text="en"></c-button-secondary>
      <c-button-secondary :is-disabled="$i18n.locale === 'ro'" @click="setLanguage('ro')" text="ro"></c-button-secondary>
    </div>
    <c-dialog @confirm="handleStartNewAdministratorDiscussion()"
              :subtitle-text="$t('thereIsNoExistingDiscussionBetweenYouAndTheAdministrator')"
              :title-text="$t('contactAdministrator')" v-model="isStartNewDiscussionDialogShown">
      <template #body>
        <c-textarea ref="cTextareaQuestion" size="small" v-model="question" class="mt-4" :rows="3"
                    data-cy="question-textarea"
                    :validator-functions="[validateRequired]"
                    :placeholder="$t('typeYourQuestionHere')"></c-textarea>
      </template>
    </c-dialog>
    <discussion-with-administrator-dialog
      ref="discussionWithAdministratorDialog"
      @close="isDiscussionWithAdministratorDialogShown = false"
      :is-dialog-shown="isDiscussionWithAdministratorDialogShown"></discussion-with-administrator-dialog>
  </div>
</template>

<script lang="ts">
import CButtonPrimary from "@/components/common/CButtonPrimary";
import Vue from "vue";
import CDialog from "@/components/common/CDialog.vue";
import CTextarea from "@/components/common/CTextarea.vue";
import validatorMixin from "@/util/validatorMixin";
import DiscussionWithAdministratorDialog from "@/components/account_view/DiscussionWithAdministratorDialog.vue";
import { CreateNewSupportThreadRequest } from "@/generated-sources/openapi";
import CButtonSecondary from "@/components/common/CButtonSecondary.vue";

export default Vue.extend({
  name: "AccountView",
  components: {
    CButtonSecondary,
    DiscussionWithAdministratorDialog,
    CButtonPrimary,
    CDialog,
    CTextarea
  },
  data() {
    return {
      isStartNewDiscussionDialogShown: false,
      isDiscussionWithAdministratorDialogShown: false,
      question: ""
    };
  },
  mixins: [validatorMixin],
  methods: {
    setLanguage(locale: string) {
      this.$i18n.locale = locale;
      localStorage.setItem('locale', locale);
    },
    handleStartNewAdministratorDiscussion() {
      let isQuestionValid = this.$refs.cTextareaQuestion.validateInput();
      if (isQuestionValid) {
        let createNewSupportThreadRequest: CreateNewSupportThreadRequest = {
          topic: this.question
        };
        this.$store
          .dispatch("userModule/createSupportThread", createNewSupportThreadRequest)
          .then((r) => {
            this.isStartNewDiscussionDialogShown = false;
            this.$refs.discussionWithAdministratorDialog.threadInfo = r.data;
            setTimeout(() => {
              this.isDiscussionWithAdministratorDialogShown = true;
            }, 0);
          });
      }
    },
    handleContactAdministrator() {
      this.$store.dispatch("userModule/fetchCurrentSupportThread")
        .then((r) => {
          if (r.data.supportThreadId) {
            this.$refs.discussionWithAdministratorDialog.threadInfo = r.data;
            this.isDiscussionWithAdministratorDialogShown = true;
          } else {
            this.isStartNewDiscussionDialogShown = true;
          }
        });
    },
    isBusinessManagementToolShown() {
      return Vue.$keycloak?.realmAccess?.roles?.includes("BUSINESS_OWNER");
    },
    isAdministratorManagementToolShown() {
      return Vue.$keycloak?.realmAccess?.roles?.includes("ADMIN");
    },
    handleLogout() {
      Vue.$keycloak.logout({
        redirectUri: process.env.VUE_APP_URL + "/"
      });
    }
  }
});
</script>

<style scoped>
.account-button-wrapper:hover p,
.account-button-wrapper:hover h4,
.account-button-wrapper:hover .account-button-icon {
  @apply text-dark-blue;
}
</style>
