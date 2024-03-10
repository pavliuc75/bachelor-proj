package com.example.backendbloom.checkout.configuration_propereties;

import com.example.backendbloom.commons.configuration_propereties.cloud.AWS;
import com.stripe.Stripe;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "stripe")
@Configuration
@Getter
@Setter
@Data
@RequiredArgsConstructor
public class StripeConfigurationProperties {
    @NotNull
    private String apiKey;
    @NotNull
    private String checkoutSuccessUrl;
    @NotNull
    private String checkoutFailureUrl;

}
