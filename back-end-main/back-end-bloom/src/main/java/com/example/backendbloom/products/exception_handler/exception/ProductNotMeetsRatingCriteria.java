package com.example.backendbloom.products.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import org.springframework.http.HttpStatus;

public class ProductNotMeetsRatingCriteria extends AbstractCustomRuntimeException {
    public ProductNotMeetsRatingCriteria(String productId) {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Can't rate product with id '%s', because it does not meet rating criteria. Product should be in your order list with the status %s", productId, OrderStatusModel.COMPLETED))
                .title("Category"));
    }
}
