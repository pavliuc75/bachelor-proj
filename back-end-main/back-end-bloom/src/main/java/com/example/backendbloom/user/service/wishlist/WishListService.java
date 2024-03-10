package com.example.backendbloom.user.service.wishlist;

import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.user.model.wishlist.WishlistModel;

public interface WishListService {
    WishlistModel addProductToWishlist(String productId) throws ObjectNotFound;
    WishlistModel removeProductFromWishlist(String productId) throws ObjectNotFound ;

    WishlistModel getCurrentUserWishlist();

}
