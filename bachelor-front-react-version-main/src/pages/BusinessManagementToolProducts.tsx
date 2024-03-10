import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchCurrentUserBusinessData, fetchProducts } from "../store/businessManagementToolSlice";
import CButtonPrimary from "../components/common/CButtonPrimary";
import CDialog from "../components/common/CDialog";
import EditProduct from "../components/business-management-tool/EditProduct";
import ProductListItem from "../components/business-management-tool/ProductListItem";
import CPagination from "../components/common/CPagination";

function BusinessManagementToolProducts() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { products, business, productsTotalPages, productsCurrentPage } = useSelector(
    (state: RootState) => state.businessManagementTool
  );

  const [isProductCreateDialogShown, setIsProductCreateDialogShown] = useState(false);

  useEffect(() => {
    if (!products?.length) {
      if (!business?.id) {
        // @ts-ignore
        dispatch(fetchCurrentUserBusinessData()).then(() => fetchProductsLocal(1));
      } else {
        fetchProductsLocal(1);
      }
    }
  }, []);

  function handlePageChange(page: number) {
    fetchProductsLocal(page);
  }

  function fetchProductsLocal(page: number) {
    // @ts-ignore
    dispatch(fetchProducts(page));
  }

  return (
    <div className="flex flex-col grow">
      <h2>{t("products")}</h2>
      <div className="flex flex-row justify-end mb-2">
        <CButtonPrimary
          onClick={() => setIsProductCreateDialogShown(true)}
          iconStart={["fas", "plus"]}
          text={t("addProduct")}></CButtonPrimary>
        <CDialog
          isShown={isProductCreateDialogShown}
          onUpdate={setIsProductCreateDialogShown}
          titleSlot={<h3>{t("addProduct")}</h3>}
          footerSlot={<div></div>}>
          <EditProduct className={"mt-8"} onClose={() => setIsProductCreateDialogShown(false)}></EditProduct>
        </CDialog>
      </div>
      {!products?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {(products || []).map((product) => (
              <ProductListItem product={product} key={product.id}></ProductListItem>
            ))}
          </div>
          {productsTotalPages > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={productsCurrentPage}
              totalPages={productsTotalPages}></CPagination>
          )}
        </div>
      )}
    </div>
  );
}

export default BusinessManagementToolProducts;
