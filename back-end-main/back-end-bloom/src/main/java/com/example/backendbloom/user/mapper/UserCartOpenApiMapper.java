package com.example.backendbloom.user.mapper;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.model.cart.ProductInCartModel;
import org.mapstruct.Mapper;

@Mapper
public interface UserCartOpenApiMapper {
    CartModel fromCartToCartModel(Cart cart);
    Cart fromCartModelToCart(CartModel cart);
    ProductInCartModel fromProductCarToProductInCartModel(ProductInCart cartModel);
    ProductInCart fromProductCartModelToProductInCart(ProductInCartModel cartModel);

}
