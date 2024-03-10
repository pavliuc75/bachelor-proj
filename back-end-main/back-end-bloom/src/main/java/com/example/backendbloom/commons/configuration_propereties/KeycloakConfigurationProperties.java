package com.example.backendbloom.commons.configuration_propereties;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.input.BOMInputStream;
import org.slf4j.Logger;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "keycloak")
@Component
@Getter
@Setter
@Slf4j
@Data
public class KeycloakConfigurationProperties {
    @NotNull
    private Boolean useResourceRoleMappings;
    @NotNull
    private Boolean bearerOnly;
    @NotNull
    private String authServerUrl;
    @NotNull
    private String realm;
    @NotNull
    private String resource;


    @PostConstruct
    void printConfiguration() {
        log.info("Realm  : " + getRealm());
        log.info("Resource  : " + getResource());
        log.info("AuthServerUrl  : " + getAuthServerUrl());
        log.info("BearerOnly  : " + getBearerOnly());
        log.info("userResourceRoleMappings  : " + getUseResourceRoleMappings());
    }
}



