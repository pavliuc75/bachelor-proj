import { useRef } from "react";
import EditBusinessPageStepTemplate from "./EditBusinessPageStepTemplate";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setBusinessApplicationAddress,
  setBusinessApplicationCompanyDescription,
  setBusinessApplicationEmail,
  setBusinessApplicationFacebook,
  setBusinessApplicationInstagram,
  setBusinessApplicationLegalName,
  setBusinessApplicationPhoneNumber,
  setBusinessApplicationWebsite,
  uploadCompanyLogo,
} from "../../store/businessManagementToolSlice";
import CInput from "../common/CInput";
import { validatorHelper } from "../../utils/validatorHelper";
import CTextarea from "../common/CTextarea";
import CFileInput from "../common/CFileInput";
import CButtonPrimary from "../common/CButtonPrimary";
import { showSnackbar } from "../../store/eventSlice";

interface Props {
  isDisabled: boolean;
  isEditMode: boolean;
  stepHeaderClicked: () => void;
  nextStepClicked: () => void;
}

function EditBusinessPageGeneralBusinessInformation(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isDisabled, isEditMode, stepHeaderClicked, nextStepClicked } = props;

  const { legalName, companyDescription } = useSelector(
    // @ts-ignore
    (state: RootState) => state.businessManagementTool.businessApplication.businessDescription
  );
  const { address, website, facebook, instagram, phoneNumber, email } = useSelector(
    // @ts-ignore
    (state: RootState) => state.businessManagementTool.businessApplication.businessContacts || {}
  );
  // @ts-ignore
  const { logoKey, logoFileUrl } = useSelector(
    // @ts-ignore
    (state: RootState) => state.businessManagementTool.businessApplication.businessLogo || {}
  );

  const cInputCompanyNameRef = useRef<any>(null);
  const cTextareaDescriptionRef = useRef<any>(null);
  const cInputAddressRef = useRef<any>(null);
  const cInputPhoneNumberRef = useRef<any>(null);
  const cInputCompanyEmailRef = useRef<any>(null);
  const cFileInputLogoRef = useRef<any>(null);
  const cInputWebsiteUrlRef = useRef<any>(null);
  const cInputFacebookUrlRef = useRef<any>(null);
  const cInputInstagramUrlRef = useRef<any>(null);

  function handleSetBusinessApplicationLegalName(newValue: string) {
    dispatch(setBusinessApplicationLegalName(newValue));
  }

  function handleSetBusinessApplicationCompanyDescription(newValue: string) {
    dispatch(setBusinessApplicationCompanyDescription(newValue));
  }

  function handleSetBusinessApplicationAddress(newValue: string) {
    dispatch(setBusinessApplicationAddress(newValue));
  }

  function handleSetBusinessApplicationWebsite(newValue: string) {
    dispatch(setBusinessApplicationWebsite(newValue));
  }

  function handleSetBusinessApplicationFacebook(newValue: string) {
    dispatch(setBusinessApplicationFacebook(newValue));
  }

  function handleSetBusinessApplicationInstagram(newValue: string) {
    dispatch(setBusinessApplicationInstagram(newValue));
  }

  function handleSetBusinessApplicationPhoneNumber(newValue: string) {
    dispatch(setBusinessApplicationPhoneNumber(newValue));
  }

  function handleSetBusinessApplicationEmail(newValue: string) {
    dispatch(setBusinessApplicationEmail(newValue));
  }

  function handleFileSelected(file: File) {
    // @ts-ignore
    dispatch(uploadCompanyLogo(file)).catch(() => {
      dispatch(
        showSnackbar({
          message: t("somethingWentWrongWhileUploadingTheFile", { count: 1 }),
          type: "error",
        })
      );
      cFileInputLogoRef.current.reset();
      cFileInputLogoRef.current.validateInput();
    });
  }

  function validateLogo(): boolean {
    if (logoKey && logoFileUrl) {
      return true;
    } else {
      cFileInputLogoRef.current.reset();
      return cFileInputLogoRef.current.validateInput();
    }
  }

  function handleNextStepClicked(e?: any) {
    if (e) e.preventDefault();

    let isCompanyNameValid = cInputCompanyNameRef.current.validateInput();
    let isAddressValid = cInputAddressRef.current.validateInput();
    let isPhoneNumberValid = cInputPhoneNumberRef.current.validateInput();
    let isEmailValid = cInputCompanyEmailRef.current.validateInput();
    let isLogoValid = validateLogo();

    if (isCompanyNameValid && isAddressValid && isPhoneNumberValid && isEmailValid && isLogoValid) {
      nextStepClicked();
    }
  }

  return (
    <EditBusinessPageStepTemplate
      stepHeaderClicked={stepHeaderClicked}
      stepNumber={1}
      stepTitle={t("generalBusinessInformation")}
      isDisabled={isDisabled}
      isEditMode={isEditMode}
      actionsEndSlot={
        <div className={"flex flex-row items-center gap-x-8 mt-8 mb-6"}>
          <CButtonPrimary
            iconEnd={["fas", "arrow-right"]}
            size={"medium"}
            text={t("continue")}
            onClick={handleNextStepClicked}></CButtonPrimary>
        </div>
      }>
      <form className="flex flex-col" onSubmit={handleNextStepClicked}>
        <CInput
          validatorFunctions={[validatorHelper.validateRequired]}
          descriptionText={t("doNotIncludeBusinessEntityTypeInformationEtc") || ""}
          labelText={t("companyName") + " *"}
          inputSize="medium"
          ref={cInputCompanyNameRef}
          value={legalName || ""}
          onUpdate={handleSetBusinessApplicationLegalName}></CInput>
        <CTextarea
          className={"mt-8"}
          labelText={t("aboutTheCompany") || ""}
          value={companyDescription || ""}
          onUpdate={handleSetBusinessApplicationCompanyDescription}
          ref={cTextareaDescriptionRef}></CTextarea>
        <CInput
          ref={cInputAddressRef}
          value={address || ""}
          onUpdate={handleSetBusinessApplicationAddress}
          inputSize="medium"
          className={"mt-8"}
          labelText={t("companyAddress") + " *"}
          validatorFunctions={[validatorHelper.validateRequired]}></CInput>
        <CInput
          ref={cInputPhoneNumberRef}
          value={phoneNumber + ""}
          onUpdate={handleSetBusinessApplicationPhoneNumber}
          inputSize="medium"
          className={"mt-8"}
          labelText={t("phoneNumber") + " *"}
          placeholder={t("examplePhoneNumber") || ""}
          validatorFunctions={[validatorHelper.validateIsPhoneNumber, validatorHelper.validateRequired]}></CInput>
        <CInput
          ref={cInputCompanyEmailRef}
          value={email || ""}
          onUpdate={handleSetBusinessApplicationEmail}
          inputSize="medium"
          className={"mt-8"}
          labelText={t("companyEmail") + " *"}
          validatorFunctions={[validatorHelper.validateEmailAddress, validatorHelper.validateRequired]}></CInput>
        <CFileInput
          ref={cFileInputLogoRef}
          onFileSelected={handleFileSelected}
          descriptionText={t("theUpdatedFileHasToBeAnImage") || ""}
          labelText={t("companyLogo") + " *"}
          className={"mt-8"}
          accept="image/png, image/jpeg, image/jpg"
          nonNativeFileName={logoKey ? t("someImageUploaded") || "" : ""}></CFileInput>
        <CInput
          ref={cInputWebsiteUrlRef}
          value={website || ""}
          onUpdate={handleSetBusinessApplicationWebsite}
          inputSize="medium"
          className={"mt-8"}
          labelText={t("companyWebsite") || ""}
          placeholder={t("exampleWebsiteUrl") || ""}></CInput>
        <CInput
          ref={cInputFacebookUrlRef}
          value={facebook || ""}
          onUpdate={handleSetBusinessApplicationFacebook}
          inputSize="medium"
          className={"mt-8"}
          labelText={"Facebook"}
          placeholder={t("exampleFacebookUrl") || ""}></CInput>
        <CInput
          ref={cInputInstagramUrlRef}
          value={instagram || ""}
          onUpdate={handleSetBusinessApplicationInstagram}
          inputSize="medium"
          className={"mt-8"}
          labelText={"Instagram"}
          placeholder={t("exampleInstagramUrl") || ""}></CInput>
      </form>
    </EditBusinessPageStepTemplate>
  );
}

export default EditBusinessPageGeneralBusinessInformation;
