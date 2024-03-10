package com.example.backendbloom.user.util.builder;

import com.backendbloom.openapi.model.NewUserRequest;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.experimental.UtilityClass;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import java.util.*;

@UtilityClass
public class KeycloakUserBuilder {
    public static UserRepresentation buildKeycloakUser(NewUserRequest newUserRequest, CredentialRepresentation credentialRepresentation, AppUserRole role) {
        UserRepresentation kcUser = new UserRepresentation();
        kcUser.setUsername(newUserRequest.getEmail());
        kcUser.setCredentials(Collections.singletonList(credentialRepresentation));
        kcUser.setFirstName(newUserRequest.getFirstName());
        kcUser.setLastName(newUserRequest.getLastName());
        kcUser.setEmail(newUserRequest.getEmail());
        kcUser.setEnabled(true);
        kcUser.setEmailVerified(false);
        return kcUser;
    }
}
