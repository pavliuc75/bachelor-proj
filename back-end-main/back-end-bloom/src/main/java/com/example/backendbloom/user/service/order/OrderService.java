package com.example.backendbloom.user.service.order;

import com.example.backendbloom.user.exception_handler.exception.OrderStatusCannotBeSet;
import com.example.backendbloom.user.exception_handler.exception.UserNotHaveBusiness;
import com.example.backendbloom.user.model.order.*;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    void fulfillOrder(String customerEmail, List<ProductInOrderModel> data, ShippingDetailsModel shippingDetails);

    List<OrderModel> getCurrentUserOrderList(OrderStatusModel filterBy);

    List<OrderToFulfillModel> getOrderToFulfillList(Optional<OrderStatusModel> filterBy) throws UserNotHaveBusiness;
    OrderToFulfillModel updateOrderToFulfillProductOrderStatus(String orderId, String productId, OrderStatusModel newStatus) throws OrderStatusCannotBeSet;
    OrderToFulfillModel getOrderToFulfillByIdAndFulfilledBy(String orderId, String fulfilledBy);

    OrderToFulfillModel updateOrderToFulfillOrderStatus(String orderId, OrderStatusModel orderStatus);

    List<OrderToFulfillModel> filterOrderToFulfillModel(List<OrderToFulfillModel> orderToFulfillModels, Optional<OrderStatusModel> filterBy);
}
