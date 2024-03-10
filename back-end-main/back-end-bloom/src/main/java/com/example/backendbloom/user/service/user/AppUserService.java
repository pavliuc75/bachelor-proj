package com.example.backendbloom.user.service.user;

import com.backendbloom.openapi.model.NewSocialUserRequest;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.user.model.AppUserModel;
import com.backendbloom.openapi.model.NewUserRequest;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface AppUserService {


    AppUserModel createMongoUser(NewUserRequest newUserRequest) throws Exception;

    AppUserModel createSocialMongoUser(NewSocialUserRequest newSocialUserRequest) throws Exception;

    Boolean verifyKeycloakUserById(String userId) throws Exception;

    String getIdOfKeycloakUser() throws Exception;

    AppUserModel setUserBusinessInformation(String userId, String businessApplicationId, String businessId) throws Exception;

    AppUserModel getAppUserById(String userId) throws ObjectNotFound;

    AppUserModel getCurrentUser();

    AppUserModel getAppUserByEmail(String email);

    boolean isUserAdmin();
    Set<String>  getCurrentUserRoles();

    AppUserModel updateUser(AppUserModel appUser);

    List<AppUserModel> getCustomersList();
}
