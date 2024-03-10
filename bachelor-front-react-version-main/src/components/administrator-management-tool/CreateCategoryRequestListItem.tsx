import {
  CategoryApplication,
  CategoryApplicationResponse,
  HandleCategoryApplicationRequest,
} from "../../generated-sources/openapi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchCreateCategoryRequests, handleCreateCategoryRequest } from "../../store/administratorManagementToolSlice";
import { showSnackbar } from "../../store/eventSlice";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";

interface Props {
  category: CategoryApplication;
}

function CreateCategoryRequestListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { category } = props;

  function handleAcceptCreateCategoryRequest() {
    let handleCategoryApplicationRequest: HandleCategoryApplicationRequest = {
      categoryId: category.id,
      categoryState: CategoryApplicationResponse.Approve,
    };

    // @ts-ignore
    dispatch(handleCreateCategoryRequest(handleCategoryApplicationRequest))
      // @ts-ignore
      .then(() => dispatch(fetchCreateCategoryRequests(1)))
      .catch(() =>
        dispatch(
          showSnackbar({
            message: t("failedToApproveTheRequest"),
            type: "error",
          })
        )
      );
  }

  function handleConfirmRejectCreateCategoryRequest() {
    let handleCategoryApplicationRequest: HandleCategoryApplicationRequest = {
      categoryId: category.id,
      categoryState: CategoryApplicationResponse.Deny,
    };

    // @ts-ignore
    dispatch(handleCreateCategoryRequest(handleCategoryApplicationRequest))
      .then(() => {
        setIsRejectCreateCategoryRequestDialogShown(false);
        // @ts-ignore
        dispatch(fetchCreateCategoryRequests(1));
      })
      .catch(() =>
        dispatch(
          showSnackbar({
            message: t("failedToRejectTheRequest"),
            type: "error",
          })
        )
      );
  }

  const [isRejectCreateCategoryRequestDialogShown, setIsRejectCreateCategoryRequestDialogShown] = useState(false);

  return (
    <div className="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
      <span className="c-text-14 truncate">{category.category}</span>
      <div className="flex items-center gap-x-3 flex-wrap">
        <CButtonSecondary text={t("accept")} onClick={handleAcceptCreateCategoryRequest} />
        <CButtonSecondary text={t("reject")} onClick={() => setIsRejectCreateCategoryRequestDialogShown(true)} />
      </div>
      <CDialog
        subtitleText={t("doYouReallyWantToReject", { name: category.category }) || ""}
        isShown={isRejectCreateCategoryRequestDialogShown}
        onUpdate={setIsRejectCreateCategoryRequestDialogShown}
        titleText={t("rejectNewCategoryRequest") || ""}
        onConfirm={handleConfirmRejectCreateCategoryRequest}></CDialog>
    </div>
  );
}

export default CreateCategoryRequestListItem;
