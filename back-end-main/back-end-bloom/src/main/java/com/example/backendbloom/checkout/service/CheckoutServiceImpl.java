package com.example.backendbloom.checkout.service;

import com.example.backendbloom.checkout.configuration_propereties.StripeConfigurationProperties;
import com.example.backendbloom.checkout.exception_handler.exception.CheckoutEmptyCart;
import com.example.backendbloom.checkout.exception_handler.exception.ExceedProductStock;
import com.example.backendbloom.commons.configuration.KeycloakAuthorizedUser;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.model.cart.ProductInCartModel;
import com.example.backendbloom.user.service.cart.UserCartService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CheckoutServiceImpl implements CheckoutService {
    private final StripeConfigurationProperties stripeConfigurationProperties;
    private final UserCartService userCartService;
    private final KeycloakAuthorizedUser keycloakAuthorizedUser;
    private final ProductService productService;

    @Override
    public Customer createCustomer(AppUserModel appUser) throws StripeException {
        Stripe.apiKey = "sk_test_51M9x5PAKzJzFFKvduSf2ZUUGxASu1y6Y79Cxtkt4RUsAhwpvLDXN2FmqVe1eW05yRa6nHsb0R5aaVbzF54RTAJY700yvkvKqiE";
        Map<String, Object> params = new HashMap<>();
        params.put("name", String.format("%s %s", appUser.getLastName(), appUser.getFirstName()));
        params.put("email", appUser.getEmail());
        return Customer.create(params);
    }

    @Override
    public Session createCheckoutSession() throws StripeException, CheckoutEmptyCart, ExceedProductStock {
        CartModel cartModel = userCartService.getUserCart();
        validateProductStockAvailability(cartModel.getProducts());
        if (cartModel.getProducts() == null) {
            throw new CheckoutEmptyCart();
        }
        List<SessionCreateParams.LineItem> sessionLineItems = new ArrayList<>();
        for (ProductInCartModel product : cartModel.getProducts()) {
            sessionLineItems.add(createSessionLineItem(product));
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setCustomerEmail(keycloakAuthorizedUser.getUserEmail())
                .setSubmitType(SessionCreateParams.SubmitType.PAY)
                .setBillingAddressCollection(SessionCreateParams.BillingAddressCollection.REQUIRED)
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCancelUrl(stripeConfigurationProperties.getCheckoutFailureUrl())
                .setSuccessUrl(stripeConfigurationProperties.getCheckoutSuccessUrl())
                .addAllLineItem(sessionLineItems)
                .setShippingAddressCollection(
                        SessionCreateParams.ShippingAddressCollection.builder()
                                .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.MD)
                                .build())
                .build();
        return Session.create(params);
    }

    private void validateProductStockAvailability(List<ProductInCartModel> products) throws ExceedProductStock{
        for (ProductInCartModel product : products) {
            ProductModel fetchedProduct = productService.getProductById(product.getProduct().getId());
            if (fetchedProduct.getStockAmount() < product.getAmount()) {
                throw new ExceedProductStock(product.getAmount(), fetchedProduct.getName(), fetchedProduct.getId(), fetchedProduct.getStockAmount());
            }

        }
    }

    private SessionCreateParams.LineItem createSessionLineItem(ProductInCartModel product) {
        return SessionCreateParams.LineItem.builder()
                .setPriceData(createPriceData(product))
                .setQuantity(Long.valueOf(product.getAmount()))
                .build();
    }

    private SessionCreateParams.LineItem.PriceData createPriceData(ProductInCartModel product) {
        return SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("mdl")
                .setUnitAmount(product.getProduct().getPrice().longValue() * 100)
                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(product.getProduct().getName())
                        .addImage(product.getProduct().getMainImage().getImageUrl())
                        .putMetadata("product_id", product.getProduct().getId())
                        .putMetadata("prodId", product.getProduct().getId())
                        .putMetadata("ps", "as")
                        .build()
                ).build();
    }
}
