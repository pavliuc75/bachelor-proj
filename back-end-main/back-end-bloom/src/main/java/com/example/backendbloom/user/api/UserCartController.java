package com.example.backendbloom.user.api;

import com.backendbloom.openapi.api.UserCartApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.user.exception_handler.exception.ProductAlreadyInCart;
import com.example.backendbloom.user.exception_handler.exception.ProductExceedsStockAmount;
import com.example.backendbloom.user.mapper.UserCartOpenApiMapper;
import com.example.backendbloom.user.model.AppUserRole;
import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.service.cart.UserCartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserCartController implements UserCartApi {
    private final UserCartService userCartService;
    private final UserCartOpenApiMapper userCartOpenApiMapper;

    @Override
    public ResponseEntity<Cart> getCart() {
        try {
            CartModel cartModel = userCartService.getUserCart();
            return new ResponseEntity<>(userCartOpenApiMapper.fromCartModelToCart(cartModel), HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<Cart> recycleCart() {
        try {
            CartModel cartModel = userCartService.recycleUserCart(java.util.Optional.empty());
            return new ResponseEntity<>(userCartOpenApiMapper.fromCartModelToCart(cartModel), HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<Cart> deleteProductInCart(DeleteProductInCartRequest deleteProductInCartRequest) {
        try {
            CartModel cartModel = userCartService.deleteProductInCart(deleteProductInCartRequest.getProductId());
            return new ResponseEntity<>(userCartOpenApiMapper.fromCartModelToCart(cartModel), HttpStatus.OK);
        } catch (ObjectNotFound | ValueNotGreaterThanZero | ProductExceedsStockAmount | ProductAlreadyInCart |
                 DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER, AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<Cart> postProductInCart(AddProductToCartRequest addProductToCartRequest) {
        try {
            CartModel cartModel = userCartService.addProductToCart(addProductToCartRequest.getId(), addProductToCartRequest.getAmount());
            return new ResponseEntity<>(userCartOpenApiMapper.fromCartModelToCart(cartModel), HttpStatus.OK);
        } catch (ObjectNotFound | ValueNotGreaterThanZero | ProductExceedsStockAmount | ProductAlreadyInCart |
                 DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER, AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<Cart> updateProductInCart(UpdateProductInCartRequest updateProductInCartRequest) {
        try {
            CartModel cartModel = userCartService.updateProductInCart(updateProductInCartRequest.getProductId(), updateProductInCartRequest.getAmount());
            return new ResponseEntity<>(userCartOpenApiMapper.fromCartModelToCart(cartModel), HttpStatus.OK);
        } catch (ObjectNotFound | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
