import { Business, BusinessApplication } from "../../generated-sources/openapi";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { downloadLegalDocument } from "../../store/administratorManagementToolSlice";
import { filesManipulationHelper } from "../../utils/filesManipulationHelper";
import "../../assets/styles/BusinessOverview.scss";
import CButtonSecondary from "../common/CButtonSecondary";
import CImageWithFallback from "../common/CImageWithFallback";

interface Props {
  business: BusinessApplication | Business;
}

function BusinessOverview(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { business } = props;

  function handleDownloadRegistrationCertificate() {
    // @ts-ignore
    dispatch(downloadLegalDocument(btoa(business.businessLegalDocuments.registrationCertificateKey))).then(
      (response: any) => {
        filesManipulationHelper.downloadFile(
          business.businessDescription.legalName + " - " + t("registrationCertificate") + ".pdf",
          response.data,
          "application/pdf"
        );
      }
    );
  }

  function handleDownloadBankStatement() {
    // @ts-ignore
    dispatch(downloadLegalDocument(btoa(business.businessLegalDocuments.bankStatementFileKey))).then(
      (response: any) => {
        filesManipulationHelper.downloadFile(
          business.businessDescription.legalName + " - " + t("bankStatement") + ".pdf",
          response.data,
          "application/pdf"
        );
      }
    );
  }

  return (
    <div data-css="BusinessOverview" className={"flex flex-col"}>
      <h4 className="mt-8">{t("generalBusinessInformation")}</h4>
      <table className="mt-4">
        <tbody>
          <tr>
            <td className="sm:w-[30%]">
              <p>{t("companyName")}</p>
            </td>
            <td>
              <span className="label block">{business.businessDescription.legalName}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("aboutTheCompany")}</p>
            </td>
            <td>
              {business.businessDescription.companyDescription ? (
                <p className={"text-cinder"}>{business.businessDescription.companyDescription}</p>
              ) : (
                <p className={"italic c-text-12"}>{t("emptyWithBraces")}</p>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("companyAddress")}</p>
            </td>
            <td>
              <a
                href={"https://maps.google.com/?q=" + business.businessContacts?.address}
                target="_blank"
                rel="noreferrer">
                <CButtonSecondary
                  className={"text-start"}
                  size={"medium"}
                  text={business.businessContacts?.address || ""}></CButtonSecondary>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("phoneNumber")}</p>
            </td>
            <td>
              <a href={"tel:" + business.businessContacts?.phoneNumber}>
                <CButtonSecondary
                  className={"text-start"}
                  size={"medium"}
                  text={(business.businessContacts?.phoneNumber || "").toString()}></CButtonSecondary>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("companyEmail")}</p>
            </td>
            <td>
              <a href={"mailto:" + business.businessContacts?.email}>
                <CButtonSecondary
                  className={"text-start"}
                  size={"medium"}
                  text={business.businessContacts?.email || ""}></CButtonSecondary>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("companyLogo")}</p>
            </td>
            <td>
              <CImageWithFallback
                src={business.businessLogo?.logoFileUrl}
                className={"w-[144px] object-cover rounded-lg aspect-square"}></CImageWithFallback>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("companyWebsite")}</p>
            </td>
            <td>
              {business.businessContacts?.website ? (
                <a href={business.businessContacts?.website} target="_blank" rel="noreferrer">
                  <CButtonSecondary
                    className={"text-start"}
                    size={"medium"}
                    text={business.businessContacts?.website || ""}></CButtonSecondary>
                </a>
              ) : (
                <p className={"italic c-text-12"}>{t("emptyWithBraces")}</p>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <p>Facebook</p>
            </td>
            <td>
              {business.businessContacts?.facebook ? (
                <a href={business.businessContacts?.facebook} target="_blank" rel="noreferrer">
                  <CButtonSecondary
                    className={"text-start"}
                    size={"medium"}
                    text={business.businessContacts?.facebook || ""}></CButtonSecondary>
                </a>
              ) : (
                <p className={"italic c-text-12"}>{t("emptyWithBraces")}</p>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <p>Instagram</p>
            </td>
            <td>
              {business.businessContacts?.instagram ? (
                <a href={business.businessContacts?.instagram} target="_blank" rel="noreferrer">
                  <CButtonSecondary
                    className={"text-start"}
                    size={"medium"}
                    text={business.businessContacts?.instagram || ""}></CButtonSecondary>
                </a>
              ) : (
                <p className={"italic c-text-12"}>{t("emptyWithBraces")}</p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <h4 className="mt-8">{t("legalBusinessInformation")} </h4>
      <table className="mt-4">
        <tbody>
          <tr>
            <td className="sm:w-[30%]">
              <p>{t("identificationCode")}</p>
            </td>
            <td>
              <span className="label block">{business.businessDescription.uniqueIdentificationCode}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("tvaCode")}</p>
            </td>
            <td>
              <span className="label block">{business.businessDescription.tvaNumber}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("businessEntityType")}</p>
            </td>
            <td>
              <span className="label block">{business.businessDescription.businessEntityType}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("registrationCertificate")}</p>
            </td>
            <td>
              <CButtonSecondary
                className={"text-start"}
                size={"medium"}
                text={t("downloadFile")}
                onClick={handleDownloadRegistrationCertificate}
                iconEnd={["fas", "download"]}
              />
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("bankStatement")}</p>
            </td>
            <td>
              <CButtonSecondary
                className={"text-start"}
                size={"medium"}
                text={t("downloadFile")}
                onClick={handleDownloadBankStatement}
                iconEnd={["fas", "download"]}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h4 className="mt-8">{t("paymentDetails")}</h4>
      <table className="mt-4">
        <tbody>
          <tr>
            <td className="sm:w-[30%]">
              <p>{t("ibanNumber")}</p>
            </td>
            <td>
              <span className="label block">{business.businessPaymentDetails.iban}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("bankName")}</p>
            </td>
            <td>
              <span className="label block">{business.businessPaymentDetails.bank}</span>
            </td>
          </tr>
          <tr>
            <td>
              <p>{t("swiftCode")}</p>
            </td>
            <td>
              <span className="label block">{business.businessPaymentDetails.swiftCode}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BusinessOverview;
