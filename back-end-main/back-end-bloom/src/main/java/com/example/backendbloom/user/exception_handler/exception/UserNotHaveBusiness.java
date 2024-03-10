package com.example.backendbloom.user.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class UserNotHaveBusiness extends AbstractCustomRuntimeException {
    public UserNotHaveBusiness(String fileKey) {
        super(new Error().status(HttpStatus.NOT_FOUND.value())
                .type(Error.TypeEnum.BUSINESS)
                .detail(String.format("User '%s' does not have a business", fileKey))
                .title("User does not have a business"));
    }
}
