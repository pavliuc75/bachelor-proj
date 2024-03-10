package com.example.backendbloom.commons.configuration;

import com.example.backendbloom.commons.configuration_propereties.KeycloakConfigurationProperties;
import com.example.backendbloom.commons.configuration_propereties.KeycloakSecretConfigurationProperties;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class KeycloakConfiguration {
    @Bean
    public KeycloakSpringBootConfigResolver keycloakConfigResolver() {
        return new KeycloakSpringBootConfigResolver();
    }

    @Bean
    public Keycloak Keycloak(KeycloakConfigurationProperties keycloakConfigurationProperties,
                             KeycloakSecretConfigurationProperties keycloakSecretConfigurationProperties) {
        String kcSecret = keycloakSecretConfigurationProperties.getSecret();
        if (kcSecret != null && !kcSecret.trim().isEmpty()) {
            return KeycloakBuilder.builder()
                    .realm(keycloakConfigurationProperties.getRealm())
                    .serverUrl(keycloakConfigurationProperties.getAuthServerUrl())
                    .clientId(keycloakConfigurationProperties.getResource())
                    .clientSecret(keycloakSecretConfigurationProperties.getSecret())
                    .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                    .build();
        }
        else
            return KeycloakBuilder.builder()
                    .serverUrl(keycloakConfigurationProperties.getAuthServerUrl())
                    .realm("master")
                    .clientId("admin-cli")
                    .username("admin")
                    .password("admin")
                    .build();
    }

}
