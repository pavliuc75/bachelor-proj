import { useTranslation } from "react-i18next";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import CInfo from "../components/common/CInfo";
import EditBusinessPage from "../components/edit-business-page/EditBusinessPage";

function BusinessManagementToolEditBusinessPage() {
  const { t } = useTranslation();

  const { businessApplication, businessApplicationReview } = useSelector(
    (state: RootState) => state.businessManagementTool
  );

  return (
    <div className="flex flex-col grow">
      <h2>{t("editBusinessPage")}</h2>
      {businessApplication?.businessApplicationState === "InReview" && (
        <CInfo className="mt-3" type="warning" text={t("status") + ": " + t("theReviewIsStillProcessing")}></CInfo>
      )}
      {businessApplication?.businessApplicationState === "Denied" && (
        <CInfo
          className="mt-3 max-w-xl"
          type="error"
          text={
            t("status") +
            ": " +
            t("yourRequestHasBeenDenied") +
            ((businessApplicationReview?.businessReviewDescription && ". Reason: ") || "") +
            (businessApplicationReview?.businessReviewDescription || "")
          }></CInfo>
      )}
      <div className={"h-10"}></div>
      <EditBusinessPage></EditBusinessPage>
    </div>
  );
}

export default BusinessManagementToolEditBusinessPage;
