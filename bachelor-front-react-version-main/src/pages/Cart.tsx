import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../store";
import { stringFormatterHelper } from "../utils/stringFormatterHelper";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkout } from "../store/cartSlice";
import { showSnackbar } from "../store/eventSlice";
import classNames from "classnames";
import ProductsListItem from "../components/products-list/ProductsListItem";
import CButtonPrimary from "../components/common/CButtonPrimary";
import CDialog from "../components/common/CDialog";

function Cart() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, isCartLoading } = useSelector((state: RootState) => state.cart);

  const [isCheckoutFailureDialogShown, setIsCheckoutFailureDialogShown] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "false") {
      setIsCheckoutFailureDialogShown(true);
    }
  }, [searchParams]);

  function getFormattedTotalPrice() {
    let totalPrice = 0;
    products?.forEach((product) => {
      totalPrice += (product?.product?.price || 0) * (product?.amount || 0);
    });
    return stringFormatterHelper.getFormattedPrice(totalPrice);
  }

  function handleCheckout() {
    // @ts-ignore
    dispatch(checkout())
      .then(({ data }: any) => {
        window.location.replace(data.redirectUrl);
      })
      .catch(() =>
        dispatch(
          showSnackbar({
            message: t("failedToCheckout"),
            type: "error",
          })
        )
      );
  }

  function handleCloseCheckoutFailureDialog() {
    setIsCheckoutFailureDialogShown(false);
    setSearchParams({ success: "null" });
  }

  return (
    <div className="container flex self-center flex-col my-16 grow">
      {!isCartLoading && (
        <div className={"flex grow flex-col"}>
          <h1 className="mb-20" data-cy="cart-page-header">
            {t("cart")}
          </h1>
          {products?.length ? (
            <div className={"flex flex-col-reverse lg:flex-row gap-x-20 gap-y-16"}>
              <div className="flex lg:w-2/3 flex-col">
                <ul className="flex flex-col gap-y-10">
                  {products?.map((product, index) => (
                    <li
                      key={product?.product?.id}
                      className={classNames({
                        "pb-10 border-b border-solid border-mid-gray": products.length !== index + 1,
                      })}>
                      <ProductsListItem
                        mode={"cart"}
                        amount={product.amount || 0}
                        product={product.product}></ProductsListItem>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={
                  "max-w-[440px] flex flex-col lg:w-1/3 border border-solid border-mid-gray lg:self-start pa-10 lg:sticky lg:top-16"
                }>
                <span className="block c-text-14 font-bold">{t("order")}</span>
                <div className="pt-5 flex flex-row justify-space-between">
                  <p className="text-cinder">{t("priceOfProducts")}</p>
                  <p className="text-cinder">{getFormattedTotalPrice()}</p>
                </div>
                <div className="py-5 flex flex-row justify-space-between border-b border-solid border-mid-gray">
                  <p className="text-cinder">{t("deliveryPrice")}</p>
                  <p className="text-cinder">0 MDL</p>
                </div>
                <div className="flex flex-row justify-space-between mt-5 mb-10">
                  <span className="block c-text-14 font-bold">{t("totalPrice")}</span>
                  <span className="block font-bold text-[22px] leading-145">{getFormattedTotalPrice()}</span>
                </div>
                <CButtonPrimary
                  className={"self-start"}
                  type={"button"}
                  iconEnd={["fas", "angles-right"]}
                  onClick={handleCheckout}
                  size="medium"
                  text={t("toCheckout")}></CButtonPrimary>
              </div>
            </div>
          ) : (
            <div className={"items-center justify-center flex flex-col grow"}>
              <h4 className="text-spun-pearl">{t("empty")}</h4>
            </div>
          )}
        </div>
      )}
      <CDialog
        isShown={isCheckoutFailureDialogShown}
        onUpdate={handleCloseCheckoutFailureDialog}
        subtitleText={t("orderFailedDescription") || ""}
        titleText={t("orderFailed") || ""}
        footerSlot={
          <div className="flex flex-row justify-end mt-3">
            <CButtonPrimary onClick={handleCloseCheckoutFailureDialog} text={t("confirm")}></CButtonPrimary>
          </div>
        }></CDialog>
    </div>
  );
}

export default Cart;
