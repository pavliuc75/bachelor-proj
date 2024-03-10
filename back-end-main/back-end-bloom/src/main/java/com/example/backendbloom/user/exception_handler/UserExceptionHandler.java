package com.example.backendbloom.user.exception_handler;

import com.example.backendbloom.products.exception_handler.exception.NullImageKey;
import com.example.backendbloom.user.exception_handler.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.backendbloom.openapi.model.Error;

@ControllerAdvice
public class UserExceptionHandler {
    @ExceptionHandler(UserAlreadyCreatedKeycloakException.class)
    public ResponseEntity<Error> userAlreadyCreatedException(UserAlreadyCreatedKeycloakException userAlreadyCreatedKeycloakException) {
        return new ResponseEntity<> (userAlreadyCreatedKeycloakException.getExceptionError(),HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SocialUserAlreadyCreatedException.class)
    public ResponseEntity<Error> socialUserAlreadyCreatedException(SocialUserAlreadyCreatedException socialUserAlreadyCreatedException) {
        return new ResponseEntity<>(socialUserAlreadyCreatedException.getExceptionError(),HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NewRoleIsNotRegisteredInKeycloak.class)
    public ResponseEntity<Error> newRolesNotRegisteredInKeycloak(NewRoleIsNotRegisteredInKeycloak newRoleIsNotRegisteredInKeycloak) {
        return new ResponseEntity<>(newRoleIsNotRegisteredInKeycloak.getExceptionError(),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserForNewRoleNotFoundException.class)
    public ResponseEntity<Error> userForNewRoleNotFoundException(UserForNewRoleNotFoundException userForNewRoleNotFoundException) {
        return new ResponseEntity<>(userForNewRoleNotFoundException.getExceptionError(),HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(UserNotHaveBusiness.class)
    public ResponseEntity<Error> userNotHaveBusinessException(UserNotHaveBusiness userNotHaveBusiness) {
        return new ResponseEntity<>( userNotHaveBusiness.getExceptionError(), HttpStatus.valueOf( userNotHaveBusiness.getExceptionError().getStatus()));
    }
    @ExceptionHandler(ProductExceedsStockAmount.class)
    public ResponseEntity<Error> productExceedsStockAmount(ProductExceedsStockAmount productExceedsStockAmount) {
        return new ResponseEntity<> (productExceedsStockAmount.getExceptionError(), HttpStatus.valueOf(productExceedsStockAmount.getExceptionError().getStatus()));
    }
    @ExceptionHandler(ProductAlreadyInCart.class)
    public ResponseEntity<Error> productAlreadyInCart(ProductAlreadyInCart productAlreadyInCart) {
        return new ResponseEntity<> (productAlreadyInCart.getExceptionError(), HttpStatus.valueOf(productAlreadyInCart.getExceptionError().getStatus()));
    }
    @ExceptionHandler(ProductAlreadyInWishlist.class)
    public ResponseEntity<Error> productAlreadyInWishlist(ProductAlreadyInWishlist productAlreadyInWishlist) {
        return new ResponseEntity<> (productAlreadyInWishlist.getExceptionError(), HttpStatus.valueOf(productAlreadyInWishlist.getExceptionError().getStatus()));
    }
    @ExceptionHandler(OrderStatusCannotBeSet.class)
    public ResponseEntity<Error> orderStatusCannotBeSet(OrderStatusCannotBeSet orderStatusCannotBeSet) {
        return new ResponseEntity<> (orderStatusCannotBeSet.getExceptionError(), HttpStatus.valueOf(orderStatusCannotBeSet.getExceptionError().getStatus()));
    }
}
