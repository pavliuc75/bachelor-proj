import { Product } from "../../generated-sources/openapi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../store/administratorManagementToolSlice";
import { showSnackbar } from "../../store/eventSlice";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";

interface Props {
  onProductDeleted: () => void;
  product: Product;
}

function BusinessPageListItemProductListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { onProductDeleted, product } = props;

  const [isDeleteProductDialogShown, setIsDeleteProductDialogShown] = useState(false);

  function handleConfirmDeleteProduct() {
    // @ts-ignore
    dispatch(deleteProduct(product.id))
      .then(() => {
        onProductDeleted();
        setIsDeleteProductDialogShown(false);
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
      <span className="c-text-14 truncate">{product.name}</span>
      <div className="flex items-center gap-x-3 flex-wrap">
        <Link target="_blank" to={"/product/" + product.id}>
          <CButtonSecondary text={t("view")} />
        </Link>
        <CButtonSecondary text={t("delete")} onClick={() => setIsDeleteProductDialogShown(true)} />
        <CDialog
          isShown={isDeleteProductDialogShown}
          onUpdate={setIsDeleteProductDialogShown}
          titleText={t("deleteProduct") || ""}
          onConfirm={handleConfirmDeleteProduct}
          subtitleText={t("doYouReallyWantToDelete", { name: product.name }) || ""}></CDialog>
      </div>
    </div>
  );
}

export default BusinessPageListItemProductListItem;
