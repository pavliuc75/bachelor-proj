package com.example.backendbloom.business.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class BusinessFileNotFound extends AbstractCustomRuntimeException {
    public BusinessFileNotFound(String fileKey) {
        super(new Error().status(HttpStatus.NOT_FOUND.value())
                .type(Error.TypeEnum.BUSINESS)
                .detail(String.format("Files %s was not found. Make sure the documents were uploaded", fileKey))
                .title("Business application"));
    }
}
