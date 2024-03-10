package com.example.backendbloom.user.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class UserAlreadyCreatedKeycloakException extends AbstractCustomRuntimeException {

    public UserAlreadyCreatedKeycloakException() {
        super(new Error().status(HttpStatus.CONFLICT.value())
                         .type(Error.TypeEnum.BUSINESS)
                         .detail("Keycloak user is already created")
                         .title("keycloak"));
    }
}
