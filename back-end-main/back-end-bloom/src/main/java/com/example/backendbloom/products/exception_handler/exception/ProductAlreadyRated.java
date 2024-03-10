package com.example.backendbloom.products.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import org.springframework.http.HttpStatus;

public class ProductAlreadyRated extends AbstractCustomRuntimeException {
    public ProductAlreadyRated(String productId) {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Product with id '%s' was already rated", productId))
                .title("Product already rated"));
    }
}
