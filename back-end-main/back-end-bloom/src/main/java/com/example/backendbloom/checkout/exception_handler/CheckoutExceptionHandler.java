package com.example.backendbloom.checkout.exception_handler;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.checkout.exception_handler.exception.CheckoutEmptyCart;
import com.example.backendbloom.checkout.exception_handler.exception.ExceedProductStock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CheckoutExceptionHandler {
    @ExceptionHandler(CheckoutEmptyCart.class)
    public ResponseEntity<Error> checkoutEmptyCart(CheckoutEmptyCart checkoutEmptyCart) {
        return new ResponseEntity<> (checkoutEmptyCart.getExceptionError(), HttpStatus.valueOf(checkoutEmptyCart.getExceptionError().getStatus()));
    }
    @ExceptionHandler(ExceedProductStock.class)
    public ResponseEntity<Error> checkoutEmptyCart(ExceedProductStock exceedProductStock) {
        return new ResponseEntity<> (exceedProductStock.getExceptionError(), HttpStatus.valueOf(exceedProductStock.getExceptionError().getStatus()));
    }
}
