import {
  OrderStatus,
  OrderToFulfill,
  PatchOrderToFulfillProductStatusRequest,
  PatchOrderToFulfillStatusRequest,
  ProductInOrder,
} from "../../generated-sources/openapi";
import "../../assets/styles/BusinessOrderListItem.scss";
import { useState } from "react";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateOrderStatus, updateProductStatus } from "../../store/businessManagementToolSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormatterHelper } from "../../utils/dateFormatterHelper";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";
import CMenu from "../common/CMenu";
import CButtonPrimary from "../common/CButtonPrimary";
import ProductItemFromOrder from "../order/ProductItemFromOrder";

interface Props {
  order: OrderToFulfill;
}

function BusinessOrderListItem(props: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { order } = props;

  const [isOrderDetailsDialogShown, setIsOrderDetailsDialogShown] = useState(false);

  function getFormattedFullPrice() {
    let fullPrice = 0;
    (order.productList || []).forEach((product) => {
      fullPrice += (product.price || 0) * (product.amount || 0);
    });
    return stringFormatterHelper.getFormattedPrice(fullPrice);
  }

  function getAvailableOrderStatuses() {
    return [
      {
        text: t("awaitingShipment"),
        value: OrderStatus.AwaitingShipment,
        selected: order.orderStatus === OrderStatus.AwaitingShipment,
        function: () => {
          if (order.orderStatus !== OrderStatus.AwaitingShipment) {
            let patchOrderToFulfillStatusRequest: PatchOrderToFulfillStatusRequest = {
              orderId: order.id || "",
              status: OrderStatus.AwaitingShipment,
            };
            // @ts-ignore
            dispatch(updateOrderStatus(patchOrderToFulfillStatusRequest));
          }
        },
      },
      {
        text: t("readyForShipment"),
        value: OrderStatus.ReadyForShipment,
        selected: order.orderStatus === OrderStatus.ReadyForShipment,
        function: () => {
          if (order.orderStatus !== OrderStatus.ReadyForShipment) {
            let patchOrderToFulfillStatusRequest: PatchOrderToFulfillStatusRequest = {
              orderId: order.id || "",
              status: OrderStatus.ReadyForShipment,
            };
            // @ts-ignore
            dispatch(updateOrderStatus(patchOrderToFulfillStatusRequest));
          }
        },
      },
    ];
  }

  function getFormattedStatus(status: string): string {
    return t(stringFormatterHelper.underscoreToCamelCase(status.toLowerCase()));
  }

  function getAvailableProductStatuses(product: ProductInOrder) {
    return [
      {
        text: t("awaitingShipment"),
        value: OrderStatus.AwaitingShipment,
        selected: product.orderStatus === OrderStatus.AwaitingShipment,
        function: () => {
          if (product.orderStatus !== OrderStatus.AwaitingShipment) {
            let patchOrderToFulfillProductStatusRequest: PatchOrderToFulfillProductStatusRequest = {
              orderId: order.id || "",
              productId: product.id || "",
              status: OrderStatus.AwaitingShipment,
            };
            // @ts-ignore
            dispatch(updateProductStatus(patchOrderToFulfillProductStatusRequest));
          }
        },
      },
      {
        text: t("readyForShipment"),
        value: OrderStatus.ReadyForShipment,
        selected: product.orderStatus === OrderStatus.ReadyForShipment,
        function: () => {
          if (product.orderStatus !== OrderStatus.ReadyForShipment) {
            let patchOrderToFulfillProductStatusRequest: PatchOrderToFulfillProductStatusRequest = {
              orderId: order.id || "",
              productId: product.id || "",
              status: OrderStatus.ReadyForShipment,
            };
            // @ts-ignore
            dispatch(updateProductStatus(patchOrderToFulfillProductStatusRequest));
          }
        },
      },
    ];
  }

  return (
    <div
      data-css="BusinessOrderListItem"
      className={"h-14 border border-solid border-mid-gray flex flex-row items-center px-5 justify-between"}>
      <div className="flex flex-row items-center gap-4">
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
                    {order.orderStatus === OrderStatus.AwaitingShipment ||
                    order.orderStatus === OrderStatus.ReadyForShipment ? (
                      <CMenu isRadio={true} items={getAvailableOrderStatuses()}>
                        <CButtonPrimary
                          type="button"
                          text={getFormattedStatus(order.orderStatus)}
                          iconEnd={["fas", "chevron-down"]}></CButtonPrimary>
                      </CMenu>
                    ) : (
                      <span className={"label block"}>{getFormattedStatus(order.orderStatus || "")}</span>
                    )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {order.productList?.map((product) => (
                <ProductItemFromOrder product={product} key={product.id}>
                  {product.orderStatus === OrderStatus.AwaitingShipment ||
                  product.orderStatus === OrderStatus.ReadyForShipment ? (
                    <CMenu isRadio={true} items={getAvailableProductStatuses(product)}>
                      <CButtonPrimary
                        type="button"
                        text={getFormattedStatus(product.orderStatus)}
                        iconEnd={["fas", "chevron-down"]}></CButtonPrimary>
                    </CMenu>
                  ) : (
                    <span className={"label block"}>{getFormattedStatus(product.orderStatus || "")}</span>
                  )}
                </ProductItemFromOrder>
              ))}
            </div>
          </div>
        </CDialog>
      </div>
    </div>
  );
}

export default BusinessOrderListItem;
