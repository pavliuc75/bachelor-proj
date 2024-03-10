import { Order, OrderStatus } from "../../generated-sources/openapi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { RootState } from "../../store";
import { fetchBusinessPages } from "../../store/businessSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormatterHelper } from "../../utils/dateFormatterHelper";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";
import ProductItemFromOrder from "./ProductItemFromOrder";
import classNames from "classnames";
import "../../assets/styles/OrderListItem.scss";
import { Link } from "react-router-dom";

interface Props {
  order: Order;
}

function OrderListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { order } = props;

  const { businessPages } = useSelector((state: RootState) => state.business);

  const [isOrderDetailsDialogShown, setIsOrderDetailsDialogShown] = useState(false);

  useEffect(() => {
    if (isOrderDetailsDialogShown) {
      let listOfRelatedBusinessIds = order.orderItems?.map((orderItem) => orderItem.fulfilledBy);
      let listOfWhetherNameOfBusinessIsAlreadyKnown = listOfRelatedBusinessIds?.map((businessId) => {
        return businessPages?.some((businessPage) => businessPage.id === businessId);
      });
      if (listOfWhetherNameOfBusinessIsAlreadyKnown?.some((isKnown) => !isKnown)) {
        // @ts-ignore
        dispatch(fetchBusinessPages(999));
      }
    }
  }, [isOrderDetailsDialogShown]);

  function getFormattedFullPrice() {
    let fullPrice = 0;
    order.orderItems?.forEach((orderItem) => {
      orderItem.productList?.forEach((product) => {
        fullPrice += (product.price || 0) * (product.amount || 0);
      });
    });
    return stringFormatterHelper.getFormattedPrice(fullPrice);
  }

  function getFormattedStatus(status: string) {
    return t(stringFormatterHelper.underscoreToCamelCase(status.toLowerCase()));
  }

  function getBusinessNameById(businessId: string) {
    return businessPages?.find((businessPage) => businessPage.id === businessId)?.businessDescription.legalName || "";
  }

  return (
    <div
      data-css="OrderListItem"
      className={"h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between"}>
      <div className="flex flex-row items-center gap-4">
        {order.orderStatus === OrderStatus.Completed && (
          <FontAwesomeIcon
            className={"text-mid-gray"}
            title={getFormattedStatus(order.orderStatus || "")}
            icon={["fas", "check"]}></FontAwesomeIcon>
        )}
        <FontAwesomeIcon
          className={"text-mid-gray"}
          title={getFormattedStatus(order.orderStatus || "")}
          icon={["fas", "truck"]}></FontAwesomeIcon>
        <span className="c-text-14 truncate">
          {t("orderFrom") + " " + dateFormatterHelper.getFormattedDateTime(new Date(order.createdDate || ""))}
        </span>
        <CButtonSecondary onClick={() => setIsOrderDetailsDialogShown(true)} text={t("seeDetails")}></CButtonSecondary>
        <CDialog
          width={"lg"}
          isShown={isOrderDetailsDialogShown}
          onUpdate={setIsOrderDetailsDialogShown}
          titleSlot={
            <h3>
              {t("orderFrom") + " " + dateFormatterHelper.getFormattedDateTime(new Date(order.createdDate || ""))}
            </h3>
          }
          footerSlot={
            <div className="mt-6 flex items-center justify-end">
              <CButtonSecondary
                onClick={() => setIsOrderDetailsDialogShown(false)}
                text={t("close")}></CButtonSecondary>
            </div>
          }>
          <div className="flex flex-col">
            <h4 className="mt-8">{t("generalOrderInformation")}</h4>
            <table className="mt-4">
              <tbody>
                <tr>
                  <td className="sm:w-[30%]">
                    <p>{t("orderDate")}</p>
                  </td>
                  <td>
                    <span className="label block">
                      {dateFormatterHelper.getFormattedDateTime(new Date(order.createdDate || ""))}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>{t("status")}</p>
                  </td>
                  <td>
                    <span className="label block">{getFormattedStatus(order.orderStatus || "")}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>{t("totalPrice")}</p>
                  </td>
                  <td>
                    <span className="label block">{getFormattedFullPrice()}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <h4 className="mt-8">{t("shippingDetails")}</h4>
            <table className="mt-4">
              <tbody>
                <tr>
                  <td className="sm:w-[30%]">
                    <p>{t("city")}</p>
                  </td>
                  <td>
                    <span className="label block">{order.shippingDetails?.city}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>{t("address")}</p>
                  </td>
                  <td>
                    <a href={"https://maps.google.com/?q=" + order.shippingDetails?.address} target="_blank">
                      <CButtonSecondary
                        text={order.shippingDetails?.address || ""}
                        className="text-start"
                        size="medium"></CButtonSecondary>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>{t("postalCode")}</p>
                  </td>
                  <td>
                    <span className="label block">{order.shippingDetails?.postalCode}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <h4 className="mt-8">{t("orderedProducts")}</h4>
            {order.orderItems?.map((orderItem, index) => (
              <div
                key={orderItem.id}
                className={classNames({
                  "mt-2": index !== 0,
                  "flex flex-col grow": true,
                })}>
                <table className="mt-4">
                  <tbody>
                    <tr>
                      <td className="sm:w-[30%]">
                        <p>{t("company")}</p>
                      </td>
                      <td>
                        <Link to={"/business-page/" + orderItem.fulfilledBy} target="_blank">
                          <CButtonSecondary
                            size="medium"
                            text={getBusinessNameById(orderItem?.fulfilledBy || "")}></CButtonSecondary>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>{t("status")}</p>
                      </td>
                      <td>
                        <span className="label block">{getFormattedStatus(orderItem?.orderStatus || "")}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 flex flex-col">
                  <p className="mb-3">{t("products")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-wrap">
                    {orderItem.productList?.map((product) => (
                      <ProductItemFromOrder
                        product={product}
                        key={product.id}
                        orderStatus={product.orderStatus}></ProductItemFromOrder>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CDialog>
      </div>
    </div>
  );
}

export default OrderListItem;
