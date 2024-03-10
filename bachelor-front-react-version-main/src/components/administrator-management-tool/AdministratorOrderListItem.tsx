import {
  OrderStatus,
  OrderToFulfill,
  PatchOrderToFulfillProductStatusRequest,
  PatchOrderToFulfillStatusRequest,
  ProductInOrder,
} from "../../generated-sources/openapi";
import "../../assets/styles/AdministratorOrderListItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormatterHelper } from "../../utils/dateFormatterHelper";
import CButtonSecondary from "../common/CButtonSecondary";
import CDialog from "../common/CDialog";
import CMenu from "../common/CMenu";
import CButtonPrimary from "../common/CButtonPrimary";
import ProductItemFromOrder from "../order/ProductItemFromOrder";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { stringFormatterHelper } from "../../utils/stringFormatterHelper";
import { updateOrderStatus, updateProductStatus } from "../../store/administratorManagementToolSlice";

interface Props {
  order: OrderToFulfill;
}

function AdministratorOrderListItem(props: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    let availableOrderStatuses = Object.values(OrderStatus);
    return availableOrderStatuses.map((status: string) => {
      return {
        text: getFormattedStatus(status),
        value: status,
        selected: order.orderStatus === status,
        function: () => {
          if (order.orderStatus !== status) {
            let patchOrderToFulfillStatusRequest: PatchOrderToFulfillStatusRequest = {
              orderId: order.id || "",
              // @ts-ignore
              status: status,
            };
            // @ts-ignore
            dispatch(updateOrderStatus(patchOrderToFulfillStatusRequest));
          }
        },
      };
    });
  }

  function getAvailableProductStatuses(product: ProductInOrder) {
    let availableOrderStatuses = Object.values(OrderStatus);
    return availableOrderStatuses.map((status: string) => {
      return {
        text: getFormattedStatus(status),
        value: status,
        selected: product.orderStatus === status,
        function: () => {
          if (product.orderStatus !== status) {
            let patchOrderToFulfillProductStatusRequest: PatchOrderToFulfillProductStatusRequest = {
              orderId: order.id || "",
              productId: product.id || "",
              // @ts-ignore
              status: status,
            };
            // @ts-ignore
            dispatch(updateProductStatus(patchOrderToFulfillProductStatusRequest));
          }
        },
      };
    });
  }

  function getFormattedStatus(status: string): string {
    return t(stringFormatterHelper.underscoreToCamelCase(status.toLowerCase()));
  }

  return (
    <div
      data-css="AdministratorOrderListItem"
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
                    <CMenu isRadio={true} items={getAvailableOrderStatuses()}>
                      <CButtonPrimary
                        type="button"
                        text={getFormattedStatus(order.orderStatus || "")}
                        iconEnd={["fas", "chevron-down"]}></CButtonPrimary>
                    </CMenu>
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
                  <CMenu isRadio={true} items={getAvailableProductStatuses(product)}>
                    <CButtonPrimary
                      type="button"
                      text={getFormattedStatus(product.orderStatus || "")}
                      iconEnd={["fas", "chevron-down"]}></CButtonPrimary>
                  </CMenu>
                </ProductItemFromOrder>
              ))}
            </div>
          </div>
        </CDialog>
      </div>
    </div>
  );
}

export default AdministratorOrderListItem;
