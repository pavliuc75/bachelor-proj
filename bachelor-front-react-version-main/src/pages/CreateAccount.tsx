import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import CInput from "../components/common/CInput";
import { validatorHelper } from "../utils/validatorHelper";
import CButtonPrimary from "../components/common/CButtonPrimary";
import { NewUserRequest } from "../generated-sources/openapi";
import { useDispatch } from "react-redux";
import { createUser } from "../store/userSlice";
import keycloak from "../authentication/keycloak";
import { showSnackbar } from "../store/eventSlice";

function CreateAccount() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailInputErrorText, setEmailInputErrorText] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const cInputFirstNameRef = useRef<any>(null);
  const cInputLastNameRef = useRef<any>(null);
  const cInputEmailRef = useRef<any>(null);
  const cInputPasswordRef = useRef<any>(null);

  function handleCreateAccountFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    let isFirstNameValid = cInputFirstNameRef.current?.validateInput();
    let isLastNameValid = cInputLastNameRef.current?.validateInput();
    let isEmailValid = cInputEmailRef.current?.validateInput();
    let isPasswordValid = cInputPasswordRef.current?.validateInput();

    if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid) {
      // @ts-ignore
      document.activeElement.blur();

      let payload: NewUserRequest = {
        firstName,
        lastName,
        email,
        password,
      };

      // @ts-ignore
      dispatch(createUser(payload))
        .then(() => {
          keycloak.login({
            redirectUri: process.env.REACT_APP_URL + "/account",
          });
        })
        .catch((error: any) => {
          if (error?.response?.status === 409) {
            setEmailInputErrorText(t("userWithThisEmailAddressExists") || "");
          } else {
            dispatch(
              showSnackbar({
                message: t("somethingWentWrong"),
                type: "error",
              })
            );
          }
        });
    }
  }

  return (
    <main className="container flex self-center flex-col my-16 max-w-3xl">
      <h2>{t("createAnAccount")}</h2>
      <form noValidate={true} onSubmit={handleCreateAccountFormSubmit}>
        <CInput
          ref={cInputFirstNameRef}
          value={firstName}
          onUpdate={setFirstName}
          inputSize="medium"
          className="mt-4"
          labelText={t("firstName") || ""}
          validatorFunctions={[validatorHelper.validateRequired]}></CInput>
        <CInput
          ref={cInputLastNameRef}
          value={lastName}
          onUpdate={setLastName}
          inputSize="medium"
          className="mt-8"
          labelText={t("lastName") || ""}
          validatorFunctions={[validatorHelper.validateRequired]}></CInput>
        <CInput
          ref={cInputEmailRef}
          value={email}
          errorText={emailInputErrorText}
          onUpdate={setEmail}
          inputSize="medium"
          className="mt-8"
          labelText={t("email") || ""}
          validatorFunctions={[validatorHelper.validateEmailAddress, validatorHelper.validateRequired]}></CInput>
        <CInput
          ref={cInputPasswordRef}
          value={password}
          onUpdate={setPassword}
          inputSize="medium"
          type="password"
          className="mt-8"
          autoComplete="new-password"
          labelText={t("password") || ""}
          validatorFunctions={[
            validatorHelper.validateContainsFiveCharacters,
            validatorHelper.validateContainsANumber,
            validatorHelper.validateRequired,
          ]}></CInput>
        <CButtonPrimary
          className="self-start mt-8"
          size="medium"
          text={t("getStarted")}
          iconEnd={["fas", "arrow-right"]}></CButtonPrimary>
      </form>
      <span className="text-sm leading-171 font-bold mt-16">{t("alreadyHaveAnAccount")} ?</span>
      <a href="" className="self-start">
        <CButtonPrimary className="self-start mt-4" text={t("goToLogin")}></CButtonPrimary>
      </a>
    </main>
  );
}

export default CreateAccount;
