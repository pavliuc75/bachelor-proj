package com.example.backendbloom.user.api;

import com.backendbloom.openapi.api.UserWishlistApi;
import com.backendbloom.openapi.model.AddRemoveProductToWishlistRequest;
import com.backendbloom.openapi.model.Wishlist;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.user.exception_handler.exception.ProductAlreadyInCart;
import com.example.backendbloom.user.exception_handler.exception.ProductAlreadyInWishlist;
import com.example.backendbloom.user.exception_handler.exception.ProductExceedsStockAmount;
import com.example.backendbloom.user.mapper.WishlistOpenApiMapper;
import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.model.wishlist.WishlistModel;
import com.example.backendbloom.user.service.wishlist.WishListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class WishlistController implements UserWishlistApi {
    private final WishListService wishListService;
    private final WishlistOpenApiMapper wishlistOpenApiMapper;

    @Override
    public ResponseEntity<Wishlist> addProductToWishlist(AddRemoveProductToWishlistRequest addRemoveProductToWishlistRequest) {
        try {
            WishlistModel wishlistModel = wishListService.addProductToWishlist(addRemoveProductToWishlistRequest.getProductId());
            return new ResponseEntity<>(wishlistOpenApiMapper.fromWishlistModelToWishlist(wishlistModel), HttpStatus.OK);
        } catch (ObjectNotFound | ProductAlreadyInWishlist |
                 DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<Wishlist> removeProductFromWishlist(AddRemoveProductToWishlistRequest addRemoveProductToWishlistRequest) {
        try {
            WishlistModel wishlistModel = wishListService.removeProductFromWishlist(addRemoveProductToWishlistRequest.getProductId());
            return new ResponseEntity<>(wishlistOpenApiMapper.fromWishlistModelToWishlist(wishlistModel), HttpStatus.OK);
        } catch (ObjectNotFound | ProductAlreadyInWishlist |
                 DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<Wishlist> getUserWishlist() {
        try {
            WishlistModel wishlist = wishListService.getCurrentUserWishlist();
            return new ResponseEntity<>(wishlistOpenApiMapper.fromWishlistModelToWishlist(wishlist), HttpStatus.OK);
        } catch ( DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
