package com.example.backendbloom.checkout.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class ExceedProductStock extends AbstractCustomRuntimeException {
    public ExceedProductStock(Integer amountCustomerWantsToCheckout, String productName, String productId, Integer productStockAmount) {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("You are trying to checkout '%d' number of product '%s' with id '%s' when it has only '%d' in stock",amountCustomerWantsToCheckout, productName, productId, productStockAmount))
                .title("Exceed Product Stock"));
    }
}
