package com.example.backendbloom.integration_tests.keycloak;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;

import com.example.backendbloom.integration_tests.RestAssuredBaseSetup;
import com.example.backendbloom.integration_tests.keycloak.util.KeycloakUserFactory;
import com.example.backendbloom.integration_tests.model.UserModelTest;
import lombok.Getter;
import org.apache.http.client.utils.URIBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import dasniko.testcontainers.keycloak.KeycloakContainer;

@Getter
public abstract class KeycloakTestContainers extends RestAssuredBaseSetup {

    private static final Logger LOGGER = LoggerFactory.getLogger(KeycloakTestContainers.class.getName());
    private static final String REALM_NAME = "Marketplace";
    static final KeycloakContainer keycloak;
    static final KeycloakUserFactory keycloakUserFactory;

    static {
        keycloak = new KeycloakContainer().withRealmImportFile("realm-export.json");
        keycloak.start();
        keycloak.getHttpPort();
        keycloakUserFactory = new KeycloakUserFactory(keycloak, REALM_NAME);
    }

    @DynamicPropertySource
    static void registerResourceServerIssuerProperty(DynamicPropertyRegistry registry) {
        registry.add("keycloak.auth-server-url", keycloak::getAuthServerUrl);
        registry.add("keycloak.resource", () -> "bloom-connect");
        registry.add("keycloak.credentials.secret", () -> "");
        registry.add("keycloak.realm", () -> REALM_NAME);

    }

    protected static KeycloakUserFactory getUserFactory() {
        return keycloakUserFactory;
    }


    protected String getUserToken(UserModelTest user) {

        try {
            URI authorizationURI = new URIBuilder(keycloak.getAuthServerUrl() + String.format("realms/%s/protocol/openid-connect/token", REALM_NAME)).build();
            WebClient webclient = WebClient.builder()
                    .build();
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.put("grant_type", Collections.singletonList("password"));
            formData.put("client_id", Collections.singletonList("bloom-connect"));
            formData.put("username", Collections.singletonList(user.getEmail()));
            formData.put("password", Collections.singletonList(user.getPassword()));

            String result = webclient.post()
                    .uri(authorizationURI)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JacksonJsonParser jsonParser = new JacksonJsonParser();

            return "Bearer " + jsonParser.parseMap(result)
                    .get("access_token")
                    .toString();
        } catch (URISyntaxException e) {
            LOGGER.error("Can't obtain an access token from Keycloak!", e);
        }

        return null;
    }
}