package com.example.backendbloom.commons.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class ValueNotPositive extends AbstractCustomRuntimeException {
    public ValueNotPositive(String subject) {
        super(new Error().status(HttpStatus.PRECONDITION_FAILED.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Value '%s' should be >= 0", subject))
                .title(String.format("%s Invalid value", subject)));
    }
}
