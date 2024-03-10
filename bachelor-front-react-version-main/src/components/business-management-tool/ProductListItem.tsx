import { Product } from "../../generated-sources/openapi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteProduct, fetchProducts } from "../../store/businessManagementToolSlice";
import { showSnackbar } from "../../store/eventSlice";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";
import EditProduct from "./EditProduct";

interface Props {
  product: Product;
}

function ProductListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { product } = props;

  const [isProductEditDialogShown, setIsProductEditDialogShown] = useState(false);
  const [isProductDeleteDialogShown, setIsProductDeleteDialogShown] = useState(false);

  function handleConfirmDeleteProduct() {
    // @ts-ignore
    dispatch(deleteProduct(product.id))
      .then(() => {
        setIsProductDeleteDialogShown(false);
        // @ts-ignore
        dispatch(fetchProducts(1));
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
          <CButtonSecondary text={t("view")}></CButtonSecondary>
        </Link>
        <CButtonSecondary text={t("edit")} onClick={() => setIsProductEditDialogShown(true)}></CButtonSecondary>
        <CButtonSecondary text={t("delete")} onClick={() => setIsProductDeleteDialogShown(true)}></CButtonSecondary>
      </div>
      <CDialog
        isShown={isProductEditDialogShown}
        onUpdate={setIsProductEditDialogShown}
        titleSlot={<h3>{t("editProduct")}</h3>}
        footerSlot={<div></div>}>
        <EditProduct
          className={"mt-8"}
          product={product}
          onClose={() => setIsProductEditDialogShown(false)}></EditProduct>
      </CDialog>
      <CDialog
        titleText={t("deleteProduct") || ""}
        subtitleText={t("doYouReallyWantToDelete", { name: product.name }) || ""}
        isShown={isProductDeleteDialogShown}
        onUpdate={setIsProductDeleteDialogShown}
        onConfirm={handleConfirmDeleteProduct}></CDialog>
    </div>
  );
}

export default ProductListItem;
