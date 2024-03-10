package com.example.backendbloom.checkout.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class CheckoutEmptyCart extends AbstractCustomRuntimeException {
    public CheckoutEmptyCart() {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail("Your cart is empty, you cannot proceed to checkout. Add at least one product to your cart")
                .title("Empty Cart"));
    }
}
