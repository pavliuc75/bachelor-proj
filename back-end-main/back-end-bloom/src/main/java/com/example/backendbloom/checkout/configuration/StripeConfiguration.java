package com.example.backendbloom.checkout.configuration;

import com.example.backendbloom.checkout.configuration_propereties.StripeConfigurationProperties;
import com.stripe.Stripe;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class StripeConfiguration {

    @Bean
    public String setupStripeApiKey(StripeConfigurationProperties stripeConfigurationProperties) {
        Stripe.apiKey = stripeConfigurationProperties.getApiKey();
        return Stripe.getApiBase();
    }
}
