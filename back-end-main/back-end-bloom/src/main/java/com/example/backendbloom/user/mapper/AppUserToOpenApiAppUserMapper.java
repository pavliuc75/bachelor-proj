package com.example.backendbloom.user.mapper;

import com.backendbloom.openapi.model.Cart;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.cart.CartModel;
import org.mapstruct.Mapper;

@Mapper
public interface AppUserToOpenApiAppUserMapper {
    AppUserModel toEntityFromOpenApiAppUser(com.backendbloom.openapi.model.AppUser appUser);
    com.backendbloom.openapi.model.AppUser toOpenApiAppUserFromEntity(AppUserModel appUser);
    Cart fromCartModelToCart(CartModel cart);


}
