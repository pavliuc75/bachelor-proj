package com.example.backendbloom.commons.configuration;

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Set;

@Configuration
public class KeycloakAuthorizedUser {
    public String getUserEmail() {
        KeycloakAuthenticationToken authentication =
                (KeycloakAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAccount().getKeycloakSecurityContext().getToken().getEmail();
    }
    public Set<String> getUserRoles() {
        KeycloakAuthenticationToken authentication =
                (KeycloakAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAccount().getRoles();
    }
}
