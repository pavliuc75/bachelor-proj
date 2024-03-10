import { Business } from "../../generated-sources/openapi";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../store/administratorManagementToolSlice";
import { showSnackbar } from "../../store/eventSlice";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";
import BusinessOverview from "./BusinessOverview";
import BusinessPageListItemProductListItem from "./BusinessPageListItemProductListItem";
import CPagination from "../common/CPagination";

interface Props {
  businessPage: Business;
}

function BusinessPageListItem(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { businessPage } = props;

  const [isBusinessProductsDialogShown, setIsBusinessProductsDialogShown] = useState(false);
  const [isBusinessOverviewDialogShown, setIsBusinessOverviewDialogShown] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsCurrentPage, setProductsCurrentPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);

  useEffect(() => {
    if (isBusinessProductsDialogShown) {
      if (!products.length) {
        fetchProductsLocal(1);
      }
    }
  }, [isBusinessProductsDialogShown]);

  function handlePageChange(page: number) {
    fetchProductsLocal(page);
  }

  function handleProductDeleted() {
    fetchProductsLocal(1);
  }

  function fetchProductsLocal(page: number) {
    // @ts-ignore
    dispatch(fetchProducts(page, businessPage.id))
      .then((response: any) => {
        setProducts(response.productList);
        setProductsCurrentPage(page);
        setProductsTotalPages(response.totalAmountOfPages);
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
      <span className="c-text-14 truncate">{businessPage.businessDescription.legalName}</span>
      <div className="flex items-center gap-x-3 flex-wrap">
        <CButtonSecondary
          text={t("products")}
          onClick={() => setIsBusinessProductsDialogShown(true)}></CButtonSecondary>
        <CButtonSecondary
          text={t("overview")}
          onClick={() => setIsBusinessOverviewDialogShown(true)}></CButtonSecondary>
      </div>
      <CDialog
        isShown={isBusinessOverviewDialogShown}
        onUpdate={setIsBusinessOverviewDialogShown}
        width={"md"}
        titleSlot={<h3>{t("businessOverview")}</h3>}
        footerSlot={
          <div className="mt-3 flex items-center justify-end">
            <CButtonSecondary
              text={t("close")}
              onClick={() => setIsBusinessOverviewDialogShown(false)}></CButtonSecondary>
          </div>
        }>
        <BusinessOverview business={businessPage}></BusinessOverview>
      </CDialog>
      <CDialog
        titleSlot={
          <h3 className="mb-8">{businessPage.businessDescription.legalName + " " + t("products").toLowerCase()}</h3>
        }
        footerSlot={
          <div className="mt-8 flex items-center justify-end">
            <CButtonSecondary
              text={t("close")}
              onClick={() => setIsBusinessProductsDialogShown(false)}></CButtonSecondary>
          </div>
        }
        isShown={isBusinessProductsDialogShown}
        onUpdate={setIsBusinessProductsDialogShown}
        width={"md"}>
        {!products.length ? (
          <div className={"flex flex-col grow items-center justify-center"}>
            <h4 className="text-spun-pearl">{t("empty")}</h4>
          </div>
        ) : (
          <div className={"flex flex-col"}>
            <div className={"flex flex-col gap-y-3"}>
              {products.map((product: any) => (
                <BusinessPageListItemProductListItem
                  key={product.id}
                  onProductDeleted={handleProductDeleted}
                  product={product}></BusinessPageListItemProductListItem>
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
      </CDialog>
    </div>
  );
}

export default BusinessPageListItem;
