package com.example.backendbloom.business.exception_handler;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.business.exception_handler.exception.BusinessChangeNotAuthorized;
import com.example.backendbloom.business.exception_handler.exception.BusinessFileNotFound;
import com.example.backendbloom.business.exception_handler.exception.FileValidation;
import com.example.backendbloom.products.exception_handler.exception.ProductNotMeetsRatingCriteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class BusinessExceptionHandler {
    @ExceptionHandler(BusinessFileNotFound.class)
    public ResponseEntity<Error> legalDocumentNotFound(BusinessFileNotFound businessDocumentFileNotFound) {
        return new ResponseEntity<> (businessDocumentFileNotFound.getExceptionError(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusinessChangeNotAuthorized.class)
    public ResponseEntity<Error> businessChangeNotAuthorized(BusinessChangeNotAuthorized businessChangeNotAuthorized) {
        return new ResponseEntity<>(businessChangeNotAuthorized.getExceptionError(), HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(FileValidation.class)
    public ResponseEntity<Error> fileValidation(FileValidation fileValidation) {
        return new ResponseEntity<> (fileValidation.getExceptionError(), HttpStatus.valueOf(fileValidation.getExceptionError().getStatus()));
    }
}
