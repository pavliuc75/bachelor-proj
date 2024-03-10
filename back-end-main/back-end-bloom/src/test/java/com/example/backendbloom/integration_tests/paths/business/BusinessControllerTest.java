package com.example.backendbloom.integration_tests.paths.business;

import com.example.backendbloom.integration_tests.keycloak.KeycloakTestContainers;

public class BusinessControllerTest  extends KeycloakTestContainers {
    private final String basePath = "/business";
    private final String createCustomerPath = basePath + "/create-customer";
}
