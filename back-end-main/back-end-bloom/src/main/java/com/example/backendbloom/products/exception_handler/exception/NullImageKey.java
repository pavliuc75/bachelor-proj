package com.example.backendbloom.products.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class NullImageKey extends AbstractCustomRuntimeException {
    public NullImageKey() {
        super(new Error().status(HttpStatus.BAD_REQUEST.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Image key is 'null'"))
                .title("Image Validation"));
    }
}
