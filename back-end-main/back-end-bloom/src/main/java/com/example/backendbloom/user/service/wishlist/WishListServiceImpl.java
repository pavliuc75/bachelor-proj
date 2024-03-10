package com.example.backendbloom.user.service.wishlist;

import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.user.exception_handler.exception.ProductAlreadyInCart;
import com.example.backendbloom.user.exception_handler.exception.ProductAlreadyInWishlist;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.cart.ProductInCartModel;
import com.example.backendbloom.user.model.wishlist.WishlistModel;
import com.example.backendbloom.user.repository.AppUserRepository;
import com.example.backendbloom.user.repository.WishlistRepository;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishListServiceImpl implements WishListService {
    private final WishlistRepository wishlistRepository;
    private final AppUserService appUserService;
    private final ProductService productService;
    private final AppUserRepository appUserRepository;

    @Override
    public WishlistModel addProductToWishlist(String productId) throws ObjectNotFound, ProductAlreadyInWishlist {
        AppUserModel currentUser = appUserService.getCurrentUser();
        WishlistModel wishlistModel;
        if (currentUser.getWishlist() == null) {
            wishlistModel = createNewWishlistForUser(currentUser);
        } else {
            wishlistModel = getWishlistById(currentUser.getWishlist().getId());
        }
        ProductModel fetchedProduct = productService.getProductById(productId);
        validateProductIsNotInWishlist(wishlistModel, fetchedProduct);
        wishlistModel.getWishlist().add(fetchedProduct);
        return wishlistRepository.save(wishlistModel);
    }

    private void validateProductIsNotInWishlist(WishlistModel wishlistModel, ProductModel productById) throws ProductAlreadyInWishlist {
        for (ProductModel wishProduct : wishlistModel.getWishlist()) {
            if (wishProduct.getId().equals(productById.getId())) {
                throw new ProductAlreadyInWishlist(productById.getName(), productById.getId());
            }
        }
    }

    @Override
    public WishlistModel getCurrentUserWishlist() {
        return appUserService.getCurrentUser().getWishlist();
    }

    @Override
    public WishlistModel removeProductFromWishlist(String productId) throws ObjectNotFound {
        AppUserModel currentUser = appUserService.getCurrentUser();
        WishlistModel wishlistModel;
        if (currentUser.getWishlist() == null) {
            throw new ObjectNotFound("Wishlist", "-1");
        } else {
            wishlistModel = getWishlistById(currentUser.getWishlist().getId());
        }
        ProductModel fetchedProduct = productService.getProductById(productId);
        wishlistModel.getWishlist().removeIf(product -> product.getId().equals(fetchedProduct.getId()));
//        wishlistModel.getWishlist().remove(fetchedProduct);
        return wishlistRepository.save(wishlistModel);
    }

    private WishlistModel createNewWishlistForUser(AppUserModel appUser) {
        WishlistModel wishlistModel = new WishlistModel();
        WishlistModel savedWishlist = wishlistRepository.save(wishlistModel);
        appUser.setWishlist(savedWishlist);
        AppUserModel appUserModel = appUserRepository.save(appUser);
        return appUserModel.getWishlist();
    }

    private WishlistModel getWishlistById(String id) throws ObjectNotFound {
        Optional<WishlistModel> wishlistModel = wishlistRepository.findById(id);
        if (wishlistModel.isPresent())
            return wishlistModel.get();
        else throw new ObjectNotFound("Wishlist", id);
    }
}
