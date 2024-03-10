package com.example.backendbloom.user.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;

public class UserForNewRoleNotFoundException extends AbstractCustomRuntimeException {
    public UserForNewRoleNotFoundException(Exception e) {
        super(new Error().status(404)
                .title("Not able to find user for a new role in keycloak")
                .detail(e.getMessage())
                .type(Error.TypeEnum.DATABASE));
    }
}
