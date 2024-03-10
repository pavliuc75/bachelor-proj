package com.example.backendbloom.user.api;

import com.backendbloom.openapi.api.UserOrderApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import com.example.backendbloom.commons.util.Pagination;
import com.example.backendbloom.user.exception_handler.exception.OrderStatusCannotBeSet;
import com.example.backendbloom.user.mapper.OrderOpenApiMapper;
import com.example.backendbloom.user.model.AppUserRole;
import com.example.backendbloom.user.model.order.OrderModel;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import com.example.backendbloom.user.model.order.OrderToFulfillModel;
import com.example.backendbloom.user.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class OrderController implements UserOrderApi {
    private final OrderService orderService;
    private final OrderOpenApiMapper orderOpenApiMapper;

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER, AppUserRole.Names.BUSINESS_OWNER, AppUserRole.Names.ADMIN})
    public ResponseEntity<OrderListResponse> getOrderList(Integer pageSize, Integer pageNumber, OrderStatus filterBy) {
        try {
            OrderStatusModel orderStatus = orderOpenApiMapper.orderStatusToOrderStatusModel(filterBy);
            List<OrderModel> userOrderList = orderService.getCurrentUserOrderList(orderStatus);
            Page<OrderModel> paginatedOrderList = Pagination.paginateList(userOrderList, pageNumber, pageSize);
            OrderListResponse orderListResponse = new OrderListResponse();
            orderListResponse.setOrderList(orderOpenApiMapper.orderModelListToOrderList(paginatedOrderList.toList()));
            orderListResponse.setTotalAmountOfElements(paginatedOrderList.getTotalElements());
            orderListResponse.setTotalAmountOfPages(paginatedOrderList.getTotalPages());
            return new ResponseEntity<>(orderListResponse, HttpStatus.OK);
        } catch (ValueNotGreaterThanZero | ValueNotPositive | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }


    @Override
    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER, AppUserRole.Names.ADMIN})
    public ResponseEntity<OrderToFulfillListResponse> getOrderToFulfillList(Integer pageSize, Integer pageNumber, OrderStatus filterBy) {
        try {
            OrderStatusModel orderStatus = orderOpenApiMapper.orderStatusToOrderStatusModel(filterBy);
            List<OrderToFulfillModel> orderToFulfillList = orderService.getOrderToFulfillList(Optional.ofNullable(orderStatus));
            Page<OrderToFulfillModel> paginatedOrderList = Pagination.paginateList(orderToFulfillList, pageNumber, pageSize);
            OrderToFulfillListResponse orderListResponse = new OrderToFulfillListResponse();
            orderListResponse.setOrderList(orderOpenApiMapper.orderToFulfillModelListToOrderToFulfillList(paginatedOrderList.toList()));
            orderListResponse.setTotalAmountOfElements(paginatedOrderList.getTotalElements());
            orderListResponse.setTotalAmountOfPages(paginatedOrderList.getTotalPages());
            return new ResponseEntity<>(orderListResponse, HttpStatus.OK);
        } catch (ValueNotGreaterThanZero | ValueNotPositive | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER, AppUserRole.Names.ADMIN})
    public ResponseEntity<OrderToFulfill> patchOrderToFulfillProductStatus(PatchOrderToFulfillProductStatusRequest patchOrderToFulfillProductStatusRequest) {
        try {
            OrderStatusModel orderStatus = orderOpenApiMapper.orderStatusToOrderStatusModel(patchOrderToFulfillProductStatusRequest.getStatus());
            OrderToFulfillModel orderToFulfillModel = orderService.updateOrderToFulfillProductOrderStatus(
                    patchOrderToFulfillProductStatusRequest.getOrderId(),
                    patchOrderToFulfillProductStatusRequest.getProductId(),
                    orderStatus);
            return new ResponseEntity<>(orderOpenApiMapper.orderToFulfillModelToOrderToFulfill(orderToFulfillModel), HttpStatus.OK);
        } catch (ObjectNotFound | OrderStatusCannotBeSet | ValueNotPositive | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER, AppUserRole.Names.ADMIN})
    public ResponseEntity<OrderToFulfill> patchOrderToFulfillStatus(PatchOrderToFulfillStatusRequest patchOrderToFulfillStatusRequest) {
        try {
            OrderStatusModel orderStatus = orderOpenApiMapper.orderStatusToOrderStatusModel(patchOrderToFulfillStatusRequest.getStatus());
            OrderToFulfillModel orderToFulfillModel = orderService.updateOrderToFulfillOrderStatus(
                    patchOrderToFulfillStatusRequest.getOrderId(),
                    orderStatus);
            return new ResponseEntity<>(orderOpenApiMapper.orderToFulfillModelToOrderToFulfill(orderToFulfillModel), HttpStatus.OK);
        } catch (ObjectNotFound | OrderStatusCannotBeSet | ValueNotPositive | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
