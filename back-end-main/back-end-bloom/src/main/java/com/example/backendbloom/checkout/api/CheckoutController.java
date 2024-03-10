package com.example.backendbloom.checkout.api;

import com.backendbloom.openapi.api.CheckoutApi;
import com.backendbloom.openapi.model.CreateCheckoutSession201Response;
import com.example.backendbloom.checkout.exception_handler.exception.CheckoutEmptyCart;
import com.example.backendbloom.checkout.exception_handler.exception.ExceedProductStock;
import com.example.backendbloom.checkout.service.CheckoutEventHandler;
import com.example.backendbloom.checkout.service.CheckoutService;
import com.example.backendbloom.commons.configuration.KeycloakAuthorizedUser;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.user.model.AppUserRole;
import com.example.backendbloom.user.repository.AppUserRepository;
import com.example.backendbloom.user.service.order.OrderService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CheckoutController implements CheckoutApi {

    private final CheckoutService stripeService;
    private final KeycloakAuthorizedUser keycloakAuthorizedUser;
    private final AppUserRepository appUserRepository;
    private final CheckoutEventHandler checkoutEventHandler;
    private final OrderService orderService;
    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER, AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<CreateCheckoutSession201Response> createCheckoutSession() {
        try {
            Session session = stripeService.createCheckoutSession();
            CreateCheckoutSession201Response response = new CreateCheckoutSession201Response();
            response.setSuccessUrl(session.getSuccessUrl());
            response.setCancelUrl(session.getCancelUrl());
            response.setRedirectUrl(session.getUrl());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ExceedProductStock | CheckoutEmptyCart | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

//    @PostMapping("/webhook")
    @ResponseBody
    @RequestMapping(    consumes="application/json",
            produces="application/json",
            method= RequestMethod.POST,
            value="webhook")
    public Object postEventsWebhook(@RequestBody String json, HttpServletRequest request) {
        try {
            String endpointSecret = "whsec_5b1e05fe8b6d9036c35f6aadd87a43b90866aa362d9f9757d347d18d2cd823b1";
            Event event = null;
            String sigHeader = request.getHeader("Stripe-Signature");
            event = Webhook.constructEvent(json, sigHeader, endpointSecret);
            checkoutEventHandler.handleSessionCheckoutEvents(event);
            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (CheckoutEmptyCart | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new DefaultServerException(e);
        }
    }


}
