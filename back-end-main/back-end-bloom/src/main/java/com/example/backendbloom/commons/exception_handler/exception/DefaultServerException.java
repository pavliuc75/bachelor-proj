package com.example.backendbloom.commons.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class DefaultServerException extends AbstractCustomRuntimeException {
    public DefaultServerException(String description) {
        super(new Error().status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                         .title("undocumented exception")
                         .detail("Probable cause: " + description).type(Error.TypeEnum.GENERAL));
    }

    public DefaultServerException(Exception e) {
        super(new Error().title(e.getMessage())
                        .detail("Server error")
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
