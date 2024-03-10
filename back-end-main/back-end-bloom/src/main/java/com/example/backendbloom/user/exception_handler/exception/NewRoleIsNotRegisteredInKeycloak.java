package com.example.backendbloom.user.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;

public class NewRoleIsNotRegisteredInKeycloak extends AbstractCustomRuntimeException {
    public NewRoleIsNotRegisteredInKeycloak(Exception e, String status) {
        super(new Error().status(404)
                .title("Unable to find new status for a user in keycloak for status: " + status)
                .detail(e.getMessage())
                .type(Error.TypeEnum.DATABASE));
    }
}
