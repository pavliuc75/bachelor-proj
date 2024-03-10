package com.example.backendbloom.commons.configuration_propereties;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "keycloak.credentials")
@Component
@Getter
@Setter
@Slf4j
@Data
public class KeycloakSecretConfigurationProperties {
        @NotNull
        private String secret;

        @PostConstruct
        void printConfiguration() {
                log.info("Secret  : " + getSecret());
        }
}
