import { Category } from "../../generated-sources/openapi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { deleteCategory, fetchCategories } from "../../store/administratorManagementToolSlice";
import { showSnackbar } from "../../store/eventSlice";
import { Link } from "react-router-dom";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";

interface Props {
  category: Category;
}

function CategoryListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { category } = props;

  const [isDeleteCategoryDialogShown, setIsDeleteCategoryDialogShown] = useState(false);

  function handleConfirmDeleteCategory() {
    // @ts-ignore
    dispatch(deleteCategory(category.id))
      .then(() => {
        setIsDeleteCategoryDialogShown(false);
        // @ts-ignore
        dispatch(fetchCategories(1));
      })
      .catch(() =>
        dispatch(
          showSnackbar({
            message: t("somethingWentWrong"),
            type: "error",
          })
        )
      );
  }

  return (
    <div className="h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between">
      <span className="c-text-14 truncate">{t((category.category || "").toLowerCase())}</span>
      <div className="flex items-center gap-x-3 flex-wrap">
        <Link
          target="_blank"
          to={{
            pathname: "/",
            search: new URLSearchParams({ categories: category.id ?? "" }).toString(),
          }}>
          <CButtonSecondary text={t("viewProducts")} />
        </Link>
        <CButtonSecondary text={t("delete")} onClick={() => setIsDeleteCategoryDialogShown(true)} />
      </div>
      <CDialog
        subtitleText={t("doYouReallyWantToDelete", { name: t((category.category || "").toLowerCase()) }) || ""}
        titleText={t("deleteCategory") || ""}
        isShown={isDeleteCategoryDialogShown}
        onConfirm={handleConfirmDeleteCategory}
        onUpdate={setIsDeleteCategoryDialogShown}></CDialog>
    </div>
  );
}

export default CategoryListItem;
