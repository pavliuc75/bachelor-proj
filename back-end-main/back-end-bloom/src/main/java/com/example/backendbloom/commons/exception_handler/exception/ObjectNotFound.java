package com.example.backendbloom.commons.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class ObjectNotFound extends AbstractCustomRuntimeException {
    public ObjectNotFound(String resourceName, String id) {
        super(new Error().status(HttpStatus.NOT_FOUND.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Resource named '%s' with id '%s' was not found or you don't have ownership over it.", resourceName, id))
                .title("Object not found"));
    }
}
