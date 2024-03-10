package com.example.backendbloom.user.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class ProductExceedsStockAmount extends AbstractCustomRuntimeException {
    public ProductExceedsStockAmount(String name, String id, Integer stockAmount) {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Product '%s' with id %s has only %d items in stock.", name, id, stockAmount))
                .title("Value exceeds stock amount"));
    }
}
