import "../assets/styles/BusinessManagementToolOther.scss";
import { useTranslation } from "react-i18next";
import CButtonSecondary from "../components/common/CButtonSecondary";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import CDialog from "../components/common/CDialog";
import { useEffect, useRef, useState } from "react";
import CInput from "../components/common/CInput";
import { validatorHelper } from "../utils/validatorHelper";
import { fetchBusinessAnalytics, sendCreateCategoryRequest } from "../store/businessManagementToolSlice";
import { fetchCategories } from "../store/productSlice";
import { CreateCategoryApplicationRequest } from "../generated-sources/openapi";
import { showSnackbar } from "../store/eventSlice";

function BusinessManagementToolOther() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { businessAnalytics } = useSelector((state: RootState) => state.businessManagementTool);
  const { categories } = useSelector((state: RootState) => state.product);

  const [isDialogShown, setIsDialogShown] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const cInputNameRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchBusinessAnalytics());
  }, []);

  function handleOpenSendCreateCategoryRequestDialog() {
    setIsDialogShown(true);
    // @ts-ignore
    dispatch(fetchCategories(true)).then(() => setIsDialogShown(true));
  }

  function validateDoesNotAlreadyExist(value: string) {
    let trimmedString = (value || "").trim().toLowerCase();
    let result = categories.some((category) => category.category === trimmedString);
    if (!value) {
      result = true;
    }
    return {
      isValid: !result,
      errorText: !result ? "" : t("thisCategoryAlreadyExists"),
    };
  }

  function handleSendCreateCategoryRequest() {
    let isNameValid = cInputNameRef?.current.validateInput();
    if (isNameValid) {
      let createCategoryApplicationRequest: CreateCategoryApplicationRequest = {
        category: categoryName.trim().toLowerCase(),
      };
      // @ts-ignore
      dispatch(sendCreateCategoryRequest(createCategoryApplicationRequest))
        .then(() => {
          dispatch(
            showSnackbar({
              message: t("requestHasBeenSent"),
              type: "success",
            })
          );
          setIsDialogShown(false);
        })
        .catch(() => {
          dispatch(
            showSnackbar({
              message: t("somethingWentWrong"),
              type: "error",
            })
          );
        });
    }
  }

  return (
    <div data-css="BusinessManagementToolOther" className="flex flex-col grow">
      <h2 className="mb-10">{t("Other")}</h2>
      <CButtonSecondary
        iconEnd={["fas", "arrow-up-right-from-square"]}
        onClick={handleOpenSendCreateCategoryRequestDialog}
        size="medium"
        text={t("requestANewCategory")}></CButtonSecondary>
      {businessAnalytics && <h3 className="mt-10 mb-6">{t("businessStats")}</h3>}
      {businessAnalytics && (
        <table className="max-w-xs">
          <tbody>
            <tr>
              <td>
                <p>{t("numberOfCompletedOrders")}</p>
              </td>
              <td>
                <span className="label block">{businessAnalytics.totalNumberOfCompletedOrders}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("numberOfIncompleteOrders")}</p>
              </td>
              <td>
                <span className="label block">{businessAnalytics.totalNumberOfOrdersToBeCompleted}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("ordersInTotal")}</p>
              </td>
              <td>
                <span className="label block">{businessAnalytics.totalIncome}</span>
              </td>
            </tr>
            <tr>
              <td>
                <p>{t("productsSold")}</p>
              </td>
              <td>
                <span className="label block">{businessAnalytics.totalSoldAmountProducts}</span>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <CDialog
        subtitleText={t("requestANewCategoryDescription") || ""}
        onConfirm={handleSendCreateCategoryRequest}
        titleText={t("requestANewCategory") || ""}
        isShown={isDialogShown}
        onUpdate={setIsDialogShown}>
        <CInput
          validatorFunctions={[validatorHelper.validateRequired, validateDoesNotAlreadyExist]}
          labelText={t("name") + " *"}
          onEnterKey={handleSendCreateCategoryRequest}
          ref={cInputNameRef}
          className="mt-4"
          value={categoryName}
          onUpdate={setCategoryName}></CInput>
      </CDialog>
    </div>
  );
}

export default BusinessManagementToolOther;
