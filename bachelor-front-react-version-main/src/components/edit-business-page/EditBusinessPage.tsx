import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EditBusinessPageGeneralBusinessInformation from "./EditBusinessPageGeneralBusinessInformation";
import EditBusinessPageLegalBusinessInformation from "./EditBusinessPageLegalBusinessInformation";
import EditBusinessPagePaymentDetails from "./EditBusinessPagePaymentDetails";
import {
  createBusinessApplication,
  setDefaultBusinessApplicationProperties,
  updateBusinessApplication,
} from "../../store/businessManagementToolSlice";
import {
  BusinessContacts,
  BusinessDescription,
  BusinessLegalDocuments,
  BusinessLogo,
  BusinessPaymentDetails,
  CreateBusinessApplicationRequest,
  UpdateBusinessApplicationRequest,
} from "../../generated-sources/openapi";
import { hideLoadingOverlay, showLoadingOverlay, showSnackbar } from "../../store/eventSlice";
import keycloak from "../../authentication/keycloak";
import { useTranslation } from "react-i18next";

interface Props {
  isCreate?: boolean;
}

function EditBusinessPage(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { isCreate } = props;

  // @ts-ignore
  const { id: businessApplicationId } = useSelector(
    (state: RootState) => state.businessManagementTool?.businessApplication || {}
  );
  const { businessApplication } = useSelector((state: RootState) => state.businessManagementTool);
  // @ts-ignore
  const { legalName, companyDescription, uniqueIdentificationCode, tvaNumber, businessEntityType } = useSelector(
    (state: RootState) => state.businessManagementTool?.businessApplication?.businessDescription || {}
  );
  const { address, website, facebook, instagram, phoneNumber, email } = useSelector(
    (state: RootState) => state.businessManagementTool?.businessApplication?.businessContacts || {}
  );
  // @ts-ignore
  const { logoKey, logoFileUrl } = useSelector(
    (state: RootState) => state.businessManagementTool?.businessApplication?.businessLogo || {}
  );
  // @ts-ignore
  const { registrationCertificateKey, registrationCertificateFileUrl, bankStatementFileKey, bankStatementFileUrl } =
    useSelector((state: RootState) => state.businessManagementTool?.businessApplication?.businessLegalDocuments || {});

  // @ts-ignore
  const { iban, swiftCode, bank } = useSelector(
    (state: RootState) => state.businessManagementTool?.businessApplication?.businessPaymentDetails || {}
  );

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isCreate) {
      dispatch(setDefaultBusinessApplicationProperties());
    }
  }, []);

  function submitCreateBusinessPageForm() {
    let businessDescription: BusinessDescription = {
      legalName,
      businessEntityType,
      uniqueIdentificationCode,
      tvaNumber,
      companyDescription,
    };
    let businessPaymentDetails: BusinessPaymentDetails = {
      iban,
      bank,
      swiftCode,
    };
    let businessLegalDocuments: BusinessLegalDocuments = {
      registrationCertificateKey,
      registrationCertificateFileUrl,
      bankStatementFileKey,
      bankStatementFileUrl,
    };
    let businessContacts: BusinessContacts = {
      phoneNumber,
      email,
      address,
      website,
      facebook,
      instagram,
    };
    let businessLogo: BusinessLogo = {
      logoKey,
      logoFileUrl,
    };

    if (isCreate) {
      let createBusinessApplicationRequest: CreateBusinessApplicationRequest = {
        businessDescription,
        businessPaymentDetails,
        businessLegalDocuments,
        businessContacts,
        businessLogo,
      };
      dispatch(showLoadingOverlay({ isInstant: false }));
      // @ts-ignore
      dispatch(createBusinessApplication(createBusinessApplicationRequest))
        .then(() => {
          keycloak.login({
            redirectUri: process.env.REACT_APP_URL + "/business-management-tool/edit-business-page",
          });
        })
        .catch(() =>
          dispatch(
            showSnackbar({
              message: t("somethingWentWrong"),
              type: "error",
            })
          )
        )
        .finally(() => dispatch(hideLoadingOverlay()));
    } else {
      let updateBusinessApplicationRequest: UpdateBusinessApplicationRequest = {
        businessDescription,
        businessPaymentDetails,
        businessLegalDocuments,
        businessContacts,
        businessLogo,
        id: businessApplicationId,
      };

      dispatch(showLoadingOverlay({ isInstant: false }));
      // @ts-ignore
      dispatch(updateBusinessApplication(updateBusinessApplicationRequest))
        .then(() => {
          dispatch(
            showSnackbar({
              message: t("newReviewRequestHasBeenSent"),
              type: "success",
            })
          );
          setCurrentStep(1);
        })
        .catch(() => {
          dispatch(
            showSnackbar({
              message: t("somethingWentWrong"),
              type: "error",
            })
          );
        })
        .finally(() => dispatch(hideLoadingOverlay()));
    }
  }

  return (
    <>
      {businessApplication && (
        <div className={"flex flex-col gap-y-10"}>
          <EditBusinessPageGeneralBusinessInformation
            isDisabled={currentStep < 1}
            isEditMode={currentStep === 1}
            stepHeaderClicked={currentStep > 1 ? () => setCurrentStep(1) : () => {}}
            nextStepClicked={() => setCurrentStep(2)}></EditBusinessPageGeneralBusinessInformation>
          <EditBusinessPageLegalBusinessInformation
            isCreate={isCreate || false}
            isDisabled={currentStep < 2}
            isEditMode={currentStep === 2}
            stepHeaderClicked={currentStep > 2 ? () => setCurrentStep(2) : () => {}}
            nextStepClicked={() => setCurrentStep(3)}
            previousStepClicked={() => setCurrentStep(1)}></EditBusinessPageLegalBusinessInformation>
          <EditBusinessPagePaymentDetails
            isDisabled={currentStep < 3}
            isEditMode={currentStep === 3}
            stepHeaderClicked={currentStep > 3 ? () => setCurrentStep(3) : () => {}}
            nextStepClicked={submitCreateBusinessPageForm}
            previousStepClicked={() => setCurrentStep(2)}></EditBusinessPagePaymentDetails>
        </div>
      )}
    </>
  );
}

export default EditBusinessPage;
