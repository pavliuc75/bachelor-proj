package com.example.backendbloom.support.exception_handler;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.support.exception_handler.exception.UserAlreadyHasActiveSupportThread;
import com.example.backendbloom.support.exception_handler.exception.UserNotAuthorizedToManageThisThread;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class SupportExceptionHandler {
    @ExceptionHandler(UserAlreadyHasActiveSupportThread.class)
    public ResponseEntity<Error> userAlreadyHasActiveSupportThread(UserAlreadyHasActiveSupportThread userAlreadyHasActiveSupportThread) {
        return new ResponseEntity<> (userAlreadyHasActiveSupportThread.getExceptionError(), HttpStatus.valueOf(userAlreadyHasActiveSupportThread.getExceptionError().getStatus()));
    }
    @ExceptionHandler(UserNotAuthorizedToManageThisThread.class)
    public ResponseEntity<Error> userNotAuthorizedToManageThisThread(UserNotAuthorizedToManageThisThread userNotAuthorizedToManageThisThread) {
        return new ResponseEntity<> (userNotAuthorizedToManageThisThread.getExceptionError(), HttpStatus.valueOf(userNotAuthorizedToManageThisThread.getExceptionError().getStatus()));
    }
}
