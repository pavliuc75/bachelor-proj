package com.example.backendbloom.products.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class ProductImageNotFound extends AbstractCustomRuntimeException {
    public ProductImageNotFound(String fileKey) {
        super(new Error().status(HttpStatus.NOT_FOUND.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Image '%s' was not found. Make sure the product image was uploaded beforehand", fileKey))
                .title("Product Image Upload"));
    }
}
