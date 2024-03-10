package com.example.backendbloom.products.exception_handler;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.products.exception_handler.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ProductExceptionHandler {
    @ExceptionHandler(ProductImageNotFound.class)
    public ResponseEntity<Error> productImageNotFound(ProductImageNotFound productImageNotFound) {
        return new ResponseEntity<> (productImageNotFound.getExceptionError(), HttpStatus.valueOf(productImageNotFound.getExceptionError().getStatus()));
    }

    @ExceptionHandler(CategoryNotFound.class)
    public ResponseEntity<Error> categoryNotFound(CategoryNotFound categoryNotFound) {
        return new ResponseEntity<> (categoryNotFound.getExceptionError(), HttpStatus.valueOf(categoryNotFound.getExceptionError().getStatus()));
    }
    @ExceptionHandler(NullImageKey.class)
    public ResponseEntity<Error> nullImageKey(NullImageKey nullImageKey) {
        return new ResponseEntity<> (nullImageKey.getExceptionError(), HttpStatus.valueOf(nullImageKey.getExceptionError().getStatus()));
    }
    @ExceptionHandler(ProductNotMeetsRatingCriteria.class)
    public ResponseEntity<Error> nullImageKey(ProductNotMeetsRatingCriteria productNotMeetsRating) {
        return new ResponseEntity<> (productNotMeetsRating.getExceptionError(), HttpStatus.valueOf(productNotMeetsRating.getExceptionError().getStatus()));
    }

    @ExceptionHandler(ProductAlreadyRated.class)
    public ResponseEntity<Error> productAlreadyRated(ProductAlreadyRated productAlreadyRated) {
        return new ResponseEntity<> (productAlreadyRated.getExceptionError(), HttpStatus.valueOf(productAlreadyRated.getExceptionError().getStatus()));
    }
}
