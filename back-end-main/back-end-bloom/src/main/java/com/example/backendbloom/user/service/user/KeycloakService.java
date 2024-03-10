package com.example.backendbloom.user.service.user;

import com.backendbloom.openapi.model.NewUserRequest;

import javax.ws.rs.core.Response;

public interface KeycloakService {
    Response createKeycloakUser(NewUserRequest newUserRequest);
    boolean addRealmRoleToUser(String userName, String role_name);
}
