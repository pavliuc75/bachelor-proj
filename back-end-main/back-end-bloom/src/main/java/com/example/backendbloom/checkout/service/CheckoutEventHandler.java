package com.example.backendbloom.checkout.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Event;

public interface CheckoutEventHandler {

    void handleSessionCheckoutEvents(Event event) throws StripeException;
}
