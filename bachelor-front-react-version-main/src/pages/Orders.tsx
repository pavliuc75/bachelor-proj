import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "../generated-sources/openapi";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import { fetchOrders, setOrdersCurrentFilter } from "../store/ordersSlice";
import { useSearchParams } from "react-router-dom";
import CTabsNavigation from "../components/common/CTabsNavigation";
import OrderListItem from "../components/order/OrderListItem";
import CPagination from "../components/common/CPagination";
import CDialog from "../components/common/CDialog";
import CButtonPrimary from "../components/common/CButtonPrimary";

function Orders() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { ordersCurrentFilter, orders, ordersTotalPages, ordersCurrentPage } = useSelector(
    (state: RootState) => state.orders
  );

  const [isCheckoutSuccessDialogShown, setIsCheckoutSuccessDialogShown] = useState(false);

  useEffect(() => {
    fetchOrdersLocal(1);
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setTimeout(() => {
        fetchOrdersLocal(1);
      }, 3000);
      setIsCheckoutSuccessDialogShown(true);
    }
  }, [searchParams]);

  const tabs = [
    {
      name: t("allOrders"),
      value: "ALL",
      selected: ordersCurrentFilter === "ALL",
    },
    {
      name: t("awaitingShipment"),
      value: OrderStatus.AwaitingShipment,
      selected: ordersCurrentFilter === OrderStatus.AwaitingShipment,
    },
    {
      name: t("shipped"),
      value: OrderStatus.Shipped,
      selected: ordersCurrentFilter === OrderStatus.Shipped,
    },
    {
      name: t("awaitingPickup"),
      value: OrderStatus.AwaitingPickup,
      selected: ordersCurrentFilter === OrderStatus.AwaitingPickup,
    },
    {
      name: t("completed"),
      value: OrderStatus.Completed,
      selected: ordersCurrentFilter === OrderStatus.Completed,
    },
  ];

  function handleTabSelected(tab: any) {
    dispatch(setOrdersCurrentFilter(tab.value));
    fetchOrdersLocal(1);
  }

  function handleCloseCheckoutSuccessDialog() {
    setIsCheckoutSuccessDialogShown(false);
    setSearchParams({ success: "null" });
  }

  function handlePageChange(page: number) {
    fetchOrdersLocal(page);
  }

  function fetchOrdersLocal(page: number) {
    // @ts-ignore
    dispatch(fetchOrders(page));
  }

  return (
    <div className="container flex self-center flex-col my-16 max-w-3xl grow">
      <h1 className="mb-10">{t("myOrders")}</h1>
      <CTabsNavigation tabs={tabs} className={"mb-2"} onTabSelected={handleTabSelected}></CTabsNavigation>
      {!orders?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {orders?.map((order) => (
              <OrderListItem key={order.id} order={order}></OrderListItem>
            ))}
          </div>
          {(ordersTotalPages || 0) > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={ordersCurrentPage}
              totalPages={ordersTotalPages}></CPagination>
          )}
        </div>
      )}
      <CDialog
        isShown={isCheckoutSuccessDialogShown}
        onUpdate={handleCloseCheckoutSuccessDialog}
        subtitleText={t("orderConfirmedDescription") || ""}
        titleText={t("orderConfirmed") || ""}
        footerSlot={
          <div className="flex flex-row justify-end mt-3">
            <CButtonPrimary onClick={handleCloseCheckoutSuccessDialog} text={t("confirm")}></CButtonPrimary>
          </div>
        }></CDialog>
    </div>
  );
}

export default Orders;
