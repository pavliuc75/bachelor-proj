package com.example.backendbloom.checkout.service;

import com.example.backendbloom.checkout.exception_handler.exception.CheckoutEmptyCart;
import com.example.backendbloom.checkout.exception_handler.exception.ExceedProductStock;
import com.example.backendbloom.user.model.AppUserModel;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

public interface CheckoutService {
    Customer createCustomer(AppUserModel appUser) throws StripeException;
    Session createCheckoutSession() throws StripeException, CheckoutEmptyCart, ExceedProductStock;

}
