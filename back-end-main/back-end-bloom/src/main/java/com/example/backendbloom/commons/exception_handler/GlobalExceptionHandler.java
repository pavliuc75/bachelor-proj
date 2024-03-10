package com.example.backendbloom.commons.exception_handler;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DefaultServerException.class)
    public ResponseEntity<Error> defaultServerException(DefaultServerException defaultServerException) {
        return new ResponseEntity<>(defaultServerException.getExceptionError(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ObjectNotFound.class)
    public ResponseEntity<Error> defaultServerException(ObjectNotFound objectNotFound) {
        return new ResponseEntity<>(objectNotFound.getExceptionError(), HttpStatus.valueOf(objectNotFound.getExceptionError().getStatus()));
    }

    @ExceptionHandler(ValueNotGreaterThanZero.class)
    public ResponseEntity<Error> valueNotGraterThanZero(ValueNotGreaterThanZero valueNotGreaterThanZero) {
        return new ResponseEntity<>(valueNotGreaterThanZero.getExceptionError(), HttpStatus.valueOf(valueNotGreaterThanZero.getExceptionError().getStatus()));
    }
    @ExceptionHandler(ValueNotPositive.class)
    public ResponseEntity<Error> valueNotGraterThanZero(ValueNotPositive valueNotGreaterThanZero) {
        return new ResponseEntity<>(valueNotGreaterThanZero.getExceptionError(), HttpStatus.valueOf(valueNotGreaterThanZero.getExceptionError().getStatus()));
    }
}
