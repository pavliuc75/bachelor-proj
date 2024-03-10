import { BusinessApplication, BusinessReviewState, CreateBusinessReviewRequest } from "../../generated-sources/openapi";
import { useState } from "react";
import {
  createBusinessApplicationReview,
  fetchCreateBusinessPageRequests,
} from "../../store/administratorManagementToolSlice";
import { useDispatch } from "react-redux";
import CButtonSecondary from "../common/CButtonSecondary";
import { useTranslation } from "react-i18next";
import CDialog from "../common/CDialog";
import BusinessOverview from "./BusinessOverview";
import CButtonPrimary from "../common/CButtonPrimary";
import CTextarea from "../common/CTextarea";

interface Props {
  request: BusinessApplication;
}

function CreateBusinessPageRequestListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { request } = props;

  const [isDialogShown, setIsDialogShown] = useState(false);
  const [isSecondaryDialogShown, setIsSecondaryDialogShown] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  function handleAccept() {
    let createBusinessReviewRequest: CreateBusinessReviewRequest = {
      businessApplicationId: request.id,
      businessReviewState: BusinessReviewState.Approved,
    };

    // @ts-ignore
    dispatch(createBusinessApplicationReview(createBusinessReviewRequest)).then(() => {
      setIsDialogShown(false);
      // @ts-ignore
      dispatch(fetchCreateBusinessPageRequests(1));
    });
  }

  function handleDecline() {
    setIsSecondaryDialogShown(true);
  }

  function handleDeclineConfirmed() {
    let createBusinessReviewRequest: CreateBusinessReviewRequest = {
      businessApplicationId: request.id,
      businessReviewState: BusinessReviewState.Denied,
      businessReviewDescription: declineReason,
    };

    // @ts-ignore
    dispatch(createBusinessApplicationReview(createBusinessReviewRequest)).then(() => {
      setIsSecondaryDialogShown(false);
      setIsDialogShown(false);
      // @ts-ignore
      dispatch(fetchCreateBusinessPageRequests(1));
    });
  }

  return (
    <div className="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
      <span className="truncate c-text-14">{request.businessDescription.legalName}</span>
      <CButtonSecondary onClick={() => setIsDialogShown(true)} text={t("review")}></CButtonSecondary>
      <CDialog
        width={"md"}
        isShown={isDialogShown}
        onUpdate={setIsDialogShown}
        titleSlot={<h3>{t("createBusinessPageRequest")}</h3>}
        footerSlot={
          <div className="mt-3 flex items-center justify-end">
            <CButtonSecondary
              className={"mr-6"}
              onClick={() => setIsDialogShown(false)}
              text={t("cancel")}></CButtonSecondary>
            <CButtonPrimary className={"mr-3"} onClick={handleAccept} text={t("accept")}></CButtonPrimary>
            <CButtonPrimary onClick={handleDecline} text={t("decline")}></CButtonPrimary>
          </div>
        }>
        <BusinessOverview business={request}></BusinessOverview>
      </CDialog>
      <CDialog
        titleText={t("declineApplication") || ""}
        isShown={isSecondaryDialogShown}
        onConfirm={handleDeclineConfirmed}
        onUpdate={setIsSecondaryDialogShown}>
        <CTextarea
          size={"small"}
          value={declineReason}
          onUpdate={setDeclineReason}
          className={"mt-4"}
          placeholder={t("pleaseSpecifyWhatIsWrongWithTheApplication") || ""}></CTextarea>
      </CDialog>
    </div>
  );
}

export default CreateBusinessPageRequestListItem;
