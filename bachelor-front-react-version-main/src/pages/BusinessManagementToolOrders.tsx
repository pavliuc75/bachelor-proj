import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchOrders, setOrdersCurrentFilter } from "../store/businessManagementToolSlice";
import CPagination from "../components/common/CPagination";
import { OrderStatus } from "../generated-sources/openapi";
import CTabsNavigation from "../components/common/CTabsNavigation";
import BusinessOrderListItem from "../components/business-management-tool/BusinessOrderListItem";

function BusinessManagementToolProducts() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { ordersCurrentFilter, orders, ordersTotalPages, ordersCurrentPage } = useSelector(
    (state: RootState) => state.businessManagementTool
  );

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
      name: t("readyForShipment"),
      value: OrderStatus.ReadyForShipment,
      selected: ordersCurrentFilter === OrderStatus.ReadyForShipment,
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

  useEffect(() => {
    fetchOrdersLocal(1);
  }, []);

  function handleTabSelected(tab: any) {
    dispatch(setOrdersCurrentFilter(tab.value));
    fetchOrdersLocal(1);
  }

  function handlePageChange(page: number) {
    fetchOrdersLocal(page);
  }

  function fetchOrdersLocal(page: number) {
    // @ts-ignore
    dispatch(fetchOrders(page));
  }

  return (
    <div className="flex flex-col grow">
      <h2 className={"mb-10"}>{t("orders")}</h2>
      <CTabsNavigation className={"mb-2"} tabs={tabs} onTabSelected={handleTabSelected}></CTabsNavigation>
      {!orders?.length ? (
        <div className={"flex flex-col grow items-center justify-center"}>
          <h4 className="text-spun-pearl">{t("empty")}</h4>
        </div>
      ) : (
        <div className={"flex flex-col"}>
          <div className="flex flex-col gap-y-3">
            {(orders || []).map((order, index) => (
              <BusinessOrderListItem order={order} key={order.id}></BusinessOrderListItem>
            ))}
          </div>
          {ordersTotalPages > 1 && (
            <CPagination
              className={"mt-8 self-center"}
              onCurrentPageChanged={handlePageChange}
              currentPage={ordersCurrentPage}
              totalPages={ordersTotalPages}></CPagination>
          )}
        </div>
      )}
    </div>
  );
}

export default BusinessManagementToolProducts;
