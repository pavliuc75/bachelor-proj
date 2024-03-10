<template>
  <div class="container flex self-center flex-col my-16 max-w-3xl">
    <h2>
      {{ $t("createAnAccount") }}
    </h2>
    <form novalidate @submit.prevent="handleCreateAccountFormSubmit">
      <c-input
        ref="cInputFirstName"
        v-model="firstName"
        size="medium"
        class="mt-4"
        :label-text="$t('firstName')"
        :validator-functions="[validateRequired]"
      ></c-input>
      <c-input
        ref="cInputLastName"
        v-model="lastName"
        size="medium"
        class="mt-8"
        :label-text="$t('lastName')"
        :validator-functions="[validateRequired]"
      ></c-input>
      <c-input
        ref="cInputEmail"
        v-model="email"
        size="medium"
        class="mt-8"
        :label-text="$t('email')"
        :validator-functions="[validateEmailAddress, validateRequired]"
      ></c-input>
      <c-input
        ref="cInputPassword"
        v-model="password"
        autocomplete="on"
        type="password"
        size="medium"
        class="mt-8"
        :label-text="$t('password')"
        :validator-functions="[
          validateContainsFiveCharacters,
          validateContainsANumber,
          validateRequired,
        ]"
      ></c-input>
      <c-button-primary
        data-cy="create-account-button"
        icon-end="fa-solid fa-arrow-right"
        size="medium"
        class="self-start mt-8"
        :text="$t('getStarted')"
      ></c-button-primary>
    </form>
    <span class="text-sm leading-171 font-bold mt-16">
      {{ $t("alreadyHaveAnAccount") }}?</span
    >
    <a href="" class="self-start">
      <c-button-primary
        class="self-start mt-4"
        :text="$t('goToLogin')"
      ></c-button-primary>
    </a>
  </div>
</template>

<script lang="ts">
import CInput from "@/components/common/CInput.vue";
import CButtonPrimary from "@/components/common/CButtonPrimary.vue";
import validatorMixin from "@/util/validatorMixin";
import Vue from "vue";
import { NewUserRequest } from "@/generated-sources/openapi";

export default Vue.extend({
  name: "CreateAccountView",
  components: { CInput, CButtonPrimary },
  mixins: [validatorMixin],
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
    };
  },
  methods: {
    handleCreateAccountFormSubmit() {
      let isFirstNameValid = this.$refs.cInputFirstName.validateInput();
      let isLastNameValid = this.$refs.cInputLastName.validateInput();
      let isEmailValid = this.$refs.cInputEmail.validateInput();
      let isPasswordValid = this.$refs.cInputPassword.validateInput();
      if (
        isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        isPasswordValid
      ) {
        document.activeElement.blur();

        let payload: NewUserRequest = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        };

        this.$store
          .dispatch("userModule/createUser", payload)
          .then(() => {
            this.$keycloak.login({
              redirectUri: process.env.VUE_APP_URL + "/account",
            });
          })
          .catch((error) => {
            if (error?.response?.status === 409) {
              this.$refs.cInputEmail.errorTextLocal = this.$t(
                "userWithThisEmailAddressExists"
              );
            } else {
              this.$store.dispatch("eventModule/showSnackbar", {
                message: this.$t("somethingWentWrong"),
                type: "error",
              });
            }
          });
      }
    },
  },
});
</script>
