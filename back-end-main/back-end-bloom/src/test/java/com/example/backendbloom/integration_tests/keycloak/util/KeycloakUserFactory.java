package com.example.backendbloom.integration_tests.keycloak.util;

import com.example.backendbloom.integration_tests.model.AppUserRoleModelTest;
import com.example.backendbloom.integration_tests.model.UserModelTest;
import com.example.backendbloom.user.exception_handler.exception.NewRoleIsNotRegisteredInKeycloak;
import com.example.backendbloom.user.exception_handler.exception.UserForNewRoleNotFoundException;
import dasniko.testcontainers.keycloak.KeycloakContainer;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import static com.example.backendbloom.user.util.KeycloakHelper.createPasswordCredentials;

public class KeycloakUserFactory {
    private String realmName;
    private KeycloakContainer keycloak;
    public KeycloakUserFactory(KeycloakContainer keycloak, String realmName) {
        this.realmName = realmName;
        this.keycloak = keycloak;

    }

    public void createKeycloakUser(UserModelTest testUserModel) {
        keycloak.getKeycloakAdminClient().realm(realmName).users();

        UsersResource usersResource = keycloak.getKeycloakAdminClient().realm(realmName).users();
        CredentialRepresentation credentialRepresentation = createPasswordCredentials(testUserModel.getPassword());
        UserRepresentation kcUser = buildKeycloakUser(testUserModel,
                credentialRepresentation);
        usersResource.create(kcUser);
        for (AppUserRoleModelTest role:testUserModel.getRoles()) {
            addRealmRoleToUser(kcUser.getUsername(), role.toString());
        }
    }

    private UserRepresentation buildKeycloakUser(UserModelTest testUserModel, CredentialRepresentation credentialRepresentation) {
        UserRepresentation kcUser = new UserRepresentation();
        kcUser.setUsername(testUserModel.getEmail());
        kcUser.setCredentials(Collections.singletonList(credentialRepresentation));
        kcUser.setFirstName(testUserModel.getFirstName());
        kcUser.setLastName(testUserModel.getLastName());
        kcUser.setEmail(testUserModel.getEmail());
        kcUser.setEnabled(true);
        kcUser.setEmailVerified(false);
        return kcUser;
    }

    public boolean addRealmRoleToUser(String userName, String role_name) {
        try {
            String userId = keycloak.getKeycloakAdminClient()
                    .realm(realmName)
                    .users()
                    .search(userName)
                    .get(0)
                    .getId();
            UserResource user = keycloak.getKeycloakAdminClient()
                    .realm(realmName)
                    .users()
                    .get(userId);
            try {
                List<RoleRepresentation> roleToAdd = new LinkedList<>();
                roleToAdd.add(keycloak.getKeycloakAdminClient()
                        .realm(realmName)
                        .roles()
                        .get(role_name)
                        .toRepresentation()
                );
                user.roles().
                        realmLevel().
                        add(roleToAdd);
                return true;
            } catch (Exception e) {
                throw new NewRoleIsNotRegisteredInKeycloak(e, role_name);
            }
        } catch (NewRoleIsNotRegisteredInKeycloak newRoleIsNotRegisteredInKeycloak) {
            throw newRoleIsNotRegisteredInKeycloak;
        } catch (Exception e) {
            throw new UserForNewRoleNotFoundException(e);
        }
    }
}
