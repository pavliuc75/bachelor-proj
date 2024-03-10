package com.example.backendbloom.user.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import org.springframework.http.HttpStatus;

public class OrderStatusCannotBeSet extends AbstractCustomRuntimeException {
    public OrderStatusCannotBeSet(OrderStatusModel statusModel) {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Status '%s' cannot be set. You can set only %s or %s", statusModel.name(), OrderStatusModel.AWAITING_SHIPMENT, OrderStatusModel.READY_FOR_SHIPMENT))
                .title("Cannot set status"));
    }
}
