package com.example.backendbloom.support.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class UserNotAuthorizedToManageThisThread extends AbstractCustomRuntimeException {
    public UserNotAuthorizedToManageThisThread(String threadId, String userId) {
        super(new Error().status(HttpStatus.UNAUTHORIZED.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("User with id '%s' not authorized to manage support thread with id : %s", userId, threadId))
                .title("Support Thread"));
    }
}
