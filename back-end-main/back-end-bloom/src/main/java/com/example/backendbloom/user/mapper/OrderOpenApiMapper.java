package com.example.backendbloom.user.mapper;

import com.backendbloom.openapi.model.Order;
import com.backendbloom.openapi.model.OrderStatus;
import com.backendbloom.openapi.model.OrderToFulfill;
import com.example.backendbloom.user.model.order.OrderModel;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import com.example.backendbloom.user.model.order.OrderToFulfillModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface OrderOpenApiMapper {
    List<Order> orderModelListToOrderList(List<OrderModel> orderModelList);
    OrderStatusModel orderStatusToOrderStatusModel(OrderStatus orderStatus);

    List<OrderToFulfill> orderToFulfillModelListToOrderToFulfillList(List<OrderToFulfillModel> orderToFulfillList);
    OrderToFulfill orderToFulfillModelToOrderToFulfill(OrderToFulfillModel orderToFulfill);
}
