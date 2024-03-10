package com.example.backendbloom.business.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class FileValidation extends AbstractCustomRuntimeException {
    public FileValidation(String message) {
        super(new Error().status(HttpStatus.CONFLICT.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Image cannot be uploaded. %s", message))
                .title("Image validation"));
    }
}
