package com.example.backendbloom.user.service.user;

import com.backendbloom.openapi.model.NewUserRequest;
import com.example.backendbloom.commons.configuration_propereties.KeycloakConfigurationProperties;
import com.example.backendbloom.user.exception_handler.exception.NewRoleIsNotRegisteredInKeycloak;
import com.example.backendbloom.user.exception_handler.exception.UserForNewRoleNotFoundException;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import javax.ws.rs.core.Response;

import java.util.LinkedList;
import java.util.List;

import static com.example.backendbloom.user.util.KeycloakHelper.createPasswordCredentials;
import static com.example.backendbloom.user.util.builder.KeycloakUserBuilder.buildKeycloakUser;

@Service
@RequiredArgsConstructor
public class KeycloakServiceImpl implements KeycloakService{
    private final Keycloak keycloak;
    private final KeycloakConfigurationProperties keycloakConfigurationProperties;
    @Override
    public Response createKeycloakUser(NewUserRequest newUserRequest) {
        UsersResource usersResource = keycloak.realm(keycloakConfigurationProperties.getRealm()).users();
        CredentialRepresentation credentialRepresentation = createPasswordCredentials(newUserRequest.getPassword());
        UserRepresentation kcUser = buildKeycloakUser(newUserRequest,
                credentialRepresentation,
                AppUserRole.CUSTOMER);
        Response keycloakResponse = usersResource.create(kcUser);
        addRealmRoleToUser(kcUser.getUsername(), AppUserRole.CUSTOMER.toString());
        return keycloakResponse;
    }

    @Override
    public boolean addRealmRoleToUser(String userName, String role_name) {
        try {
            String userId = keycloak
                    .realm(keycloakConfigurationProperties.getRealm())
                    .users()
                    .search(userName)
                    .get(0)
                    .getId();
            UserResource user = keycloak
                    .realm(keycloakConfigurationProperties.getRealm())
                    .users()
                    .get(userId);
            try {
                List<RoleRepresentation> roleToAdd = new LinkedList<>();
                roleToAdd.add(keycloak
                        .realm(keycloakConfigurationProperties.getRealm())
                        .roles()
                        .get(role_name)
                        .toRepresentation()
                );
                user.roles().
                        realmLevel().
                        add(roleToAdd);
                return true;
            } catch (Exception e) {
                throw new NewRoleIsNotRegisteredInKeycloak(e,role_name);
            }
        } catch (NewRoleIsNotRegisteredInKeycloak newRoleIsNotRegisteredInKeycloak) {
            throw newRoleIsNotRegisteredInKeycloak;
        } catch (Exception e) {
            throw  new UserForNewRoleNotFoundException(e);
        }
    }
}
