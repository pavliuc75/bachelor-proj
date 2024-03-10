import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ".././assets/styles/Account.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import keycloak from "../authentication/keycloak";
import CButtonPrimary from "../components/common/CButtonPrimary";
import CButtonSecondary from "../components/common/CButtonSecondary";
import CDialog from "../components/common/CDialog";
import { useRef, useState } from "react";
import CTextarea from "../components/common/CTextarea";
import { validatorHelper } from "../utils/validatorHelper";
import DiscussionWithAdministratorDialog from "../components/account/DiscussionWithAdministratorDialog";
import { CreateNewSupportThreadRequest, SupportThread } from "../generated-sources/openapi";
import { createSupportThread, fetchCurrentSupportThread } from "../store/userSlice";
import { useDispatch } from "react-redux";

function Account() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const [isStartNewDiscussionDialogShown, setIsStartNewDiscussionDialogShown] = useState(false);
  const [newDiscussionQuestion, setNewDiscussionQuestion] = useState("");
  const [discussionWithAdministratorDialogShown, setDiscussionWithAdministratorDialogShown] = useState(false);
  const [discussionWithAdministratorDialogThreadInfo, setDiscussionWithAdministratorDialogThreadInfo] =
    useState<SupportThread | null>(null);

  const cTextareaQuestionRef = useRef<any>(null);

  const isBusinessManagementToolShown = keycloak?.realmAccess?.roles?.includes("BUSINESS_OWNER") || false;
  const isAdministratorManagementToolShown = keycloak?.realmAccess?.roles?.includes("ADMIN") || false;
  const currentLocale = i18n.language;

  function handleContactAdministrator() {
    // @ts-ignore
    dispatch(fetchCurrentSupportThread()).then((r) => {
      if (r.data.supportThreadId) {
        setDiscussionWithAdministratorDialogThreadInfo(r.data as SupportThread);
        setDiscussionWithAdministratorDialogShown(true);
      } else {
        setIsStartNewDiscussionDialogShown(true);
      }
    });
  }

  function handleLogout() {
    keycloak.logout({
      redirectUri: process.env.REACT_APP_URL,
    });
  }

  function handleSetLanguage(locale: string) {
    i18n.changeLanguage(locale);
    localStorage.setItem("locale", locale);
  }

  function handleStartNewAdministratorDiscussion() {
    let isQuestionValid = cTextareaQuestionRef.current?.validateInput();
    if (isQuestionValid) {
      let createNewSupportThreadRequest: CreateNewSupportThreadRequest = {
        topic: newDiscussionQuestion,
      };
      // @ts-ignore
      dispatch(createSupportThread(createNewSupportThreadRequest)).then((r) => {
        setIsStartNewDiscussionDialogShown(false);
        setDiscussionWithAdministratorDialogThreadInfo(r.data as SupportThread);
        setDiscussionWithAdministratorDialogShown(true);
      });
    }
  }

  return (
    <main className="container flex self-center flex-col my-16">
      <div className="mb-8 flex flex-row justify-between">
        <h1>{t("yourAccount")}</h1>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link
          to="/cart"
          className="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue">
          <FontAwesomeIcon
            icon={["fas", "shopping-cart"]}
            className="text-mid-gray self-start mb-3 account-button-icon"></FontAwesomeIcon>
          <h4 className="mb-4">{t("shoppingCart")}</h4>
          <p>{t("shoppingCartDescription")}</p>
        </Link>
        <Link
          to="/favorites"
          className="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue">
          <FontAwesomeIcon
            icon={["fas", "heart"]}
            className="text-mid-gray self-start mb-3 account-button-icon"></FontAwesomeIcon>
          <h4 className="mb-4">{t("favoriteItems")}</h4>
          <p>{t("favoriteItemsDescription")}</p>
        </Link>
        <Link
          to="/orders"
          className="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue">
          <FontAwesomeIcon
            icon={["fas", "clock-rotate-left"]}
            className="text-mid-gray self-start mb-3 account-button-icon"></FontAwesomeIcon>
          <h4 className="mb-4">{t("myOrders")}</h4>
          <p>{t("myOrdersDescription")}</p>
        </Link>
        {isBusinessManagementToolShown && !isAdministratorManagementToolShown && (
          <Link
            to="/business-management-tool"
            className="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue">
            <FontAwesomeIcon
              icon={["fas", "briefcase"]}
              className="text-mid-gray self-start mb-3 account-button-icon"></FontAwesomeIcon>
            <h4 className="mb-4">{t("businessManagementTool")}</h4>
            <p>{t("businessManagementToolDescription")}</p>
          </Link>
        )}
        {isAdministratorManagementToolShown && (
          <Link
            to="/administrator-management-tool"
            className="account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue">
            <FontAwesomeIcon
              icon={["fas", "solar-panel"]}
              className="text-mid-gray self-start mb-3 account-button-icon"></FontAwesomeIcon>
            <h4 className="mb-4">{t("administratorManagementTool")}</h4>
            <p>{t("administratorManagementToolDescription")}</p>
          </Link>
        )}
        {!isAdministratorManagementToolShown && (
          <button
            onClick={handleContactAdministrator}
            type="button"
            className="items-start text-left account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue">
            <FontAwesomeIcon
              icon={["fas", "comments"]}
              className="text-mid-gray self-start mb-3 account-button-icon"></FontAwesomeIcon>
            <h4 className="mb-4">{t("contactAdministrator")}</h4>
            <p>{t("contactAdministratorDescription")}</p>
          </button>
        )}
        <button
          onClick={handleLogout}
          type="button"
          className="items-start text-left account-button-wrapper flex flex-col basis-1/3 p-8 border border-mid-gray border-solid rounded-lg hover:cursor-pointer hover:border-dark-blue">
          <FontAwesomeIcon
            icon={["fas", "right-to-bracket"]}
            className="text-mid-gray self-start mb-3 account-button-icon"></FontAwesomeIcon>
          <h4 className="mb-4">{t("logout")}</h4>
          <p>{t("logoutDescription")}</p>
        </button>
      </div>
      {!isBusinessManagementToolShown && (
        <div>
          <h4 className="mt-20">{t("doYouWantToSellYourProductsOnOurPlatform")}?</h4>
          <Link to="/create-business-page" className="self-start">
            <CButtonPrimary className="self-start mt-4" text={t("createABusinessPage")}></CButtonPrimary>
          </Link>
        </div>
      )}
      <div className="flex flex-row justify-end gap-1 mt-16">
        <CButtonSecondary
          isDisabled={currentLocale === "en"}
          onClick={() => handleSetLanguage("en")}
          text="en"></CButtonSecondary>
        <CButtonSecondary
          isDisabled={currentLocale === "ro"}
          onClick={() => handleSetLanguage("ro")}
          text="ro"></CButtonSecondary>
      </div>
      <CDialog
        subtitleText={t("thereIsNoExistingDiscussionBetweenYouAndTheAdministrator") || ""}
        titleText={t("contactAdministrator") || ""}
        onConfirm={handleStartNewAdministratorDiscussion}
        isShown={isStartNewDiscussionDialogShown}
        onUpdate={setIsStartNewDiscussionDialogShown}>
        <CTextarea
          className="mt-4"
          rows={3}
          placeholder={t("typeYourQuestionHere") || ""}
          validatorFunctions={[validatorHelper.validateRequired]}
          size="small"
          value={newDiscussionQuestion}
          ref={cTextareaQuestionRef}
          onUpdate={setNewDiscussionQuestion}></CTextarea>
      </CDialog>
      <DiscussionWithAdministratorDialog
        isDialogShown={discussionWithAdministratorDialogShown}
        onClose={() => setDiscussionWithAdministratorDialogShown(false)}
        discussionWithAdministratorDialogThreadInfo={
          discussionWithAdministratorDialogThreadInfo
        }></DiscussionWithAdministratorDialog>
    </main>
  );
}

export default Account;
