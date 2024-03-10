package com.example.backendbloom.user.mapper;

import com.backendbloom.openapi.model.Wishlist;
import com.example.backendbloom.user.model.wishlist.WishlistModel;
import org.mapstruct.Mapper;

@Mapper
public interface WishlistOpenApiMapper {
    Wishlist fromWishlistModelToWishlist(WishlistModel wishlistModel);

}
