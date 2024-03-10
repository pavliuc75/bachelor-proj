package com.example.backendbloom.user.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class ProductAlreadyInWishlist extends AbstractCustomRuntimeException {
    public ProductAlreadyInWishlist(String name, String id) {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Product '%s' with id %s is already in wishlist.", name, id))
                .title("Product Already in wishlist"));
    }
}
