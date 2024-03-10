package com.example.backendbloom.support.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class UserAlreadyHasActiveSupportThread extends AbstractCustomRuntimeException {
    public UserAlreadyHasActiveSupportThread(String userId) {
        super(new Error().status(HttpStatus.FORBIDDEN.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("User with id '%s' already has active support thread", userId))
                .title("Support Thread"));
    }
}
