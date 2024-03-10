package com.example.backendbloom.user.service.cart;

import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.user.exception_handler.exception.ProductAlreadyInCart;
import com.example.backendbloom.user.exception_handler.exception.ProductExceedsStockAmount;
import com.example.backendbloom.user.model.cart.CartModel;

import java.util.Optional;

public interface UserCartService {

    CartModel addProductToCart(String id, Integer amount) throws ValueNotGreaterThanZero,ObjectNotFound, ProductExceedsStockAmount, ProductAlreadyInCart;

    CartModel getUserCart();

    CartModel recycleUserCart(Optional<String> userId);

    CartModel updateProductInCart(String productId, Integer amount);

    CartModel deleteProductInCart(String productId);
}
