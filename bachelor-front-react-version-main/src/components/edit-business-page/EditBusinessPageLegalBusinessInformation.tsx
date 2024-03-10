import { useRef, useState } from "react";
import EditBusinessPageStepTemplate from "./EditBusinessPageStepTemplate";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessApplicationBankStatementFileKey,
  setBusinessApplicationBankStatementFileUrl,
  setBusinessApplicationBusinessEntityType,
  setBusinessApplicationRegistrationCertificateFileUrl,
  setBusinessApplicationRegistrationCertificateKey,
  setBusinessApplicationTvaNumber,
  setBusinessApplicationUniqueIdentificationCode,
  uploadLegalDocuments,
} from "../../store/businessManagementToolSlice";
import CInput from "../common/CInput";
import { validatorHelper } from "../../utils/validatorHelper";
import CMenu from "../common/CMenu";
import CButtonPrimary from "../common/CButtonPrimary";
import CInfo from "../common/CInfo";
import CFileInput from "../common/CFileInput";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "../../store/eventSlice";
import { BusinessDescriptionBusinessEntityTypeEnum } from "../../generated-sources/openapi";

interface Props {
  isCreate: boolean;
  isDisabled: boolean;
  isEditMode: boolean;
  stepHeaderClicked: () => void;
  nextStepClicked: () => void;
  previousStepClicked: () => void;
}

function EditBusinessPageLegalBusinessInformation(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { isCreate, isDisabled, isEditMode, stepHeaderClicked, nextStepClicked, previousStepClicked } = props;

  const { uniqueIdentificationCode, tvaNumber, businessEntityType } = useSelector(
    // @ts-ignore
    (state: RootState) => state.businessManagementTool.businessApplication.businessDescription || {}
  );

  const { registrationCertificateKey, registrationCertificateFileUrl, bankStatementFileKey, bankStatementFileUrl } =
    useSelector(
      // @ts-ignore
      (state: RootState) => state.businessManagementTool.businessApplication.businessLegalDocuments || {}
    );

  const [tempRegistrationCertificateFile, setTempRegistrationCertificateFile] = useState<any>(null);
  const [tempBankStatementFile, setTempBankStatementFile] = useState<any>(null);

  const cInputIdentificationCodeRef = useRef<any>(null);
  const cInputTvaCodeRef = useRef<any>(null);
  const cFileInputRegistrationCertificateRef = useRef<any>(null);
  const cFileInputBankStatementRef = useRef<any>(null);

  let businessEntityTypeOptions = [];

  for (let key in BusinessDescriptionBusinessEntityTypeEnum) {
    businessEntityTypeOptions.push({
      // @ts-ignore
      text: BusinessDescriptionBusinessEntityTypeEnum[key],
      // @ts-ignore
      selected: businessEntityType === BusinessDescriptionBusinessEntityTypeEnum[key],
      function: () =>
        // @ts-ignore
        handleSetBusinessApplicationBusinessEntityType(BusinessDescriptionBusinessEntityTypeEnum[key]),
    });
  }

  function handleSetBusinessApplicationUniqueIdentificationCode(newValue: string) {
    dispatch(setBusinessApplicationUniqueIdentificationCode(newValue));
  }

  function handleSetBusinessApplicationTvaNumber(newValue: string) {
    dispatch(setBusinessApplicationTvaNumber(newValue));
  }

  function handleSetBusinessApplicationBusinessEntityType(newValue: string) {
    dispatch(setBusinessApplicationBusinessEntityType(newValue));
  }

  function handleNextStepClicked(e?: any) {
    if (e) e.preventDefault();

    let isIdentificationCodeValid = cInputIdentificationCodeRef.current.validateInput();
    let isTvaCodeValid = cInputTvaCodeRef.current.validateInput();
    let isLegalDocumentsValid = validateLegalDocuments();

    if (isIdentificationCodeValid && isTvaCodeValid && isLegalDocumentsValid) nextStepClicked();
  }

  function registrationCertificateSelected(registrationCertificate: File) {
    setTempRegistrationCertificateFile(registrationCertificate);
    if (tempBankStatementFile) {
      uploadLegalDocumentsLocal();
    }
  }

  function bankStatementSelected(bankStatement: File) {
    setTempBankStatementFile(bankStatement);
    if (tempRegistrationCertificateFile) {
      uploadLegalDocumentsLocal();
    }
  }

  function uploadLegalDocumentsLocal() {
    dispatch(showLoadingOverlay({ isInstant: true }));
    dispatch(
      // @ts-ignore
      uploadLegalDocuments({
        registrationCertificate: tempRegistrationCertificateFile,
        bankStatement: tempBankStatementFile,
      })
    )
      .then((response: any) => {
        dispatch(setBusinessApplicationRegistrationCertificateKey(response.data.registrationCertificateKey));
        dispatch(setBusinessApplicationRegistrationCertificateFileUrl(response.data.registrationCertificateFileUrl));
        dispatch(setBusinessApplicationBankStatementFileKey(response.data.bankStatementFileKey));
        dispatch(setBusinessApplicationBankStatementFileUrl(response.data.bankStatementFileUrl));
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            message: t("somethingWentWrongWhileUploadingTheFile", { count: 2 }),
            type: "error",
          })
        );
        cFileInputRegistrationCertificateRef.current.reset();
        cFileInputBankStatementRef.current.reset();
        setTempRegistrationCertificateFile(null);
        setTempBankStatementFile(null);
        cFileInputRegistrationCertificateRef.current.validateInput();
        cFileInputBankStatementRef.current.validateInput();
      })
      .finally(() => dispatch(hideLoadingOverlay()));
  }

  function validateLegalDocuments() {
    if (registrationCertificateKey && registrationCertificateFileUrl && bankStatementFileKey && bankStatementFileUrl) {
      return true;
    } else {
      if (!tempRegistrationCertificateFile) {
        cFileInputRegistrationCertificateRef.current.reset();
        cFileInputRegistrationCertificateRef.current.validateInput();
      }
      if (!tempBankStatementFile) {
        cFileInputBankStatementRef.current.reset();
        cFileInputBankStatementRef.current.validateInput();
      }
      return false;
    }
  }

  return (
    <EditBusinessPageStepTemplate
      stepHeaderClicked={stepHeaderClicked}
      nextStepClicked={handleNextStepClicked}
      previousStepClicked={previousStepClicked}
      stepNumber={2}
      stepTitle={t("legalBusinessInformation")}
      isEditMode={isEditMode}
      isDisabled={isDisabled}>
      <form className={"flex flex-col"} onSubmit={handleNextStepClicked}>
        <CInput
          ref={cInputIdentificationCodeRef}
          value={uniqueIdentificationCode + ""}
          onUpdate={handleSetBusinessApplicationUniqueIdentificationCode}
          inputSize={"medium"}
          labelText={t("identificationCode") + " *"}
          validatorFunctions={[validatorHelper.validateRequired, validatorHelper.validateIsInteger]}></CInput>
        <CInput
          className={"mt-8"}
          ref={cInputTvaCodeRef}
          value={tvaNumber + ""}
          onUpdate={handleSetBusinessApplicationTvaNumber}
          inputSize={"medium"}
          labelText={t("tvaCode") + " *"}
          validatorFunctions={[validatorHelper.validateRequired, validatorHelper.validateIsInteger]}></CInput>
        <span className="block c-text-14 mt-8 mb-2">{t("businessEntityType") + " *"}</span>
        <div className="inline-block">
          <CMenu items={businessEntityTypeOptions} isRadio={true}>
            <CButtonPrimary type="button" iconEnd={["fas", "chevron-down"]} text={businessEntityType}></CButtonPrimary>
          </CMenu>
        </div>
        {isCreate ? (
          <CInfo className={"max-w-sm mt-10"} text={t("theFilesBelowHaveToBeInPdfFormat") || ""}></CInfo>
        ) : (
          <CInfo
            className={"max-w-sm mt-10"}
            text={
              t("theFilesBelowHaveToBeInPdfFormat") +
              "\n" +
              t("pleaseBeAwareThatIfYouNeedToReUploadOneFileYouWillHaveTo").toUpperCase()
            }></CInfo>
        )}
        <CFileInput
          ref={cFileInputRegistrationCertificateRef}
          accept="application/pdf"
          className={"mt-8"}
          labelText={t("registrationCertificate") + " *"}
          onFileSelected={registrationCertificateSelected}
          nonNativeFileName={registrationCertificateKey ? t("somePdfUploaded") || "" : ""}></CFileInput>
        <CFileInput
          ref={cFileInputBankStatementRef}
          accept="application/pdf"
          className={"mt-8"}
          labelText={t("bankStatement") + " *"}
          onFileSelected={bankStatementSelected}
          nonNativeFileName={bankStatementFileKey ? t("somePdfUploaded") || "" : ""}></CFileInput>
      </form>
    </EditBusinessPageStepTemplate>
  );
}

export default EditBusinessPageLegalBusinessInformation;
