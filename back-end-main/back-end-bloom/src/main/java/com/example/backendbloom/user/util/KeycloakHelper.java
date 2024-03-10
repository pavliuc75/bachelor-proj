package com.example.backendbloom.user.util;

import lombok.experimental.UtilityClass;
import org.keycloak.representations.idm.CredentialRepresentation;

@UtilityClass
public class KeycloakHelper {
    public static CredentialRepresentation createPasswordCredentials(String password) {
        CredentialRepresentation passwordCredentials = new CredentialRepresentation();
        passwordCredentials.setTemporary(false);
        passwordCredentials.setType(CredentialRepresentation.PASSWORD);
        passwordCredentials.setValue(password);
        return passwordCredentials;
    }
}
