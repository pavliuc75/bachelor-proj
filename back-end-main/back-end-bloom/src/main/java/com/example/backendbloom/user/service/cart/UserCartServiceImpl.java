package com.example.backendbloom.user.service.cart;

import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.user.exception_handler.exception.ProductAlreadyInCart;
import com.example.backendbloom.user.exception_handler.exception.ProductExceedsStockAmount;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.model.cart.ProductInCartModel;
import com.example.backendbloom.user.repository.UserCartRepository;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCartServiceImpl implements UserCartService {
    //    private final KeycloakAuthorizedUser keycloakAuthorizedUser;
//    private final AppUserRepository appUserRepository;
    private final UserCartRepository userCartRepository;
    private final ProductService productService;
    private final AppUserService appUserService;

    @Override
    public CartModel getUserCart() {
        AppUserModel appUser = appUserService.getCurrentUser();
        return appUser.getCart();
    }

    @Override
    public CartModel recycleUserCart(Optional<String> userId) {
        CartModel userCart;
        AppUserModel appUser;
        if(userId.isPresent()){
            appUser = appUserService.getAppUserById(userId.get());
            userCart = appUser.getCart();
        }else {
            appUser = appUserService.getCurrentUser();
            userCart = getCartById(appUser.getCart().getId());
        }
        CartModel newCart;
        if (userCart != null) {
            userCartRepository.delete(userCart);
        }
        newCart = createNewCartForUser(appUser);
        return newCart;
    }

    @Override
    public CartModel deleteProductInCart(String productId) {
        CartModel cartModel = getUserCart();
        for (ProductInCartModel productInCartModel : cartModel.getProducts()) {
            if (productInCartModel.getProduct().getId().equals(productId)) {
                cartModel.getProducts().remove(productInCartModel);
                cartModel.setTotalPrice(cartModel.getTotalPrice().subtract(productInCartModel.getProduct().getPrice()));
                cartModel.setTotalElements(cartModel.getProducts().size());
                break;
            }
        }
        return userCartRepository.save(cartModel);
    }

    @Override
    public CartModel updateProductInCart(String productId, Integer amount) {
        AppUserModel appUser = appUserService.getCurrentUser();
        CartModel userCart;
        if (appUser.getCart() == null) {
            throw new ObjectNotFound("Cart", "null");
        } else {
            userCart = appUser.getCart();
        }
        updateCartProduct(userCart, productId, amount);
        BigDecimal totalCartPrice = calculateCartTotalPrice(userCart);
        //        Set total elements
        userCart.setTotalElements(userCart.getProducts().size());
        userCart.setTotalPrice(totalCartPrice);
        return userCartRepository.save(userCart);
    }


    @Override
    public CartModel addProductToCart(String id, Integer amount) throws ValueNotGreaterThanZero, ObjectNotFound, ProductExceedsStockAmount, ProductAlreadyInCart {
        AppUserModel appUser = appUserService.getCurrentUser();
        CartModel userCart;
        if (appUser.getCart() == null) {
            userCart = createNewCartForUser(appUser);
        } else {
            userCart = getCartById(appUser.getCart().getId());
        }
        ProductModel fetchedProduct = productService.getProductById(id);
        validateProductStockAvailability(fetchedProduct, amount);

        validateProductIsNotAlreadyInCart(userCart, fetchedProduct);
        ProductInCartModel productInCart = buildProductInCart(fetchedProduct, amount);
        userCart.getProducts().add(productInCart);
        BigDecimal totalCartPrice = calculateCartTotalPrice(userCart);
        //        Set total elements
        userCart.setTotalElements(userCart.getProducts().size());
        userCart.setTotalPrice(totalCartPrice);
        return userCartRepository.save(userCart);
    }

    private void validateProductStockAvailability(ProductModel product, Integer amount) {
        if (amount <= 0) {
            throw new ValueNotGreaterThanZero("Amount");
        }
        if (product.getStockAmount() < amount) {
            throw new ProductExceedsStockAmount(product.getName(), product.getId(), product.getStockAmount());
        }
    }

    private BigDecimal calculateCartTotalPrice(CartModel userCart) {
        return userCart.getProducts().stream()
                .map(x -> x.getProduct().getPrice().multiply(BigDecimal.valueOf(x.getAmount())))    // map
                .reduce(BigDecimal.ZERO, BigDecimal::add);      // reduce
    }

    private ProductInCartModel buildProductInCart(ProductModel fetchedProduct, Integer amount) {
        ProductInCartModel productInCartModel = new ProductInCartModel();
        productInCartModel.setProduct(fetchedProduct);
        productInCartModel.setAmount(amount);
        return productInCartModel;
    }

    private void validateProductIsNotAlreadyInCart(CartModel userCart, ProductModel fetchedProduct) throws ProductAlreadyInCart {
        for (ProductInCartModel productInCart : userCart.getProducts()) {
            if (productInCart.getProduct().getId().equals(fetchedProduct.getId())) {
                throw new ProductAlreadyInCart(fetchedProduct.getName(), fetchedProduct.getId());
            }
        }
    }

    private CartModel createNewCartForUser(AppUserModel appUser) {
        CartModel cart = new CartModel();
        CartModel savedCart = userCartRepository.save(cart);
        appUser.setCart(savedCart);
        AppUserModel appUserModel = appUserService.updateUser(appUser);
        return appUserModel.getCart();
    }

    private void updateCartProduct(CartModel cart, String productId, Integer amount) {
        ProductModel productModel = productService.getProductById(productId);
        validateProductStockAvailability(productModel, amount);
        for (ProductInCartModel product : cart.getProducts()) {
            if (product.getProduct().getId().equals(productId)) {
                product.setAmount(amount);
            }
        }
    }

    public CartModel getCartById(String id) {
        Optional<CartModel> cart = userCartRepository.findById(id);
        if (cart.isPresent())
            return cart.get();
        else throw new ObjectNotFound("Cart", id);
    }
}
