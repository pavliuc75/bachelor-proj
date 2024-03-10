package com.example.backendbloom.user.api;

import com.backendbloom.openapi.api.UsersApi;
import com.backendbloom.openapi.model.AppUser;
import com.backendbloom.openapi.model.NewSocialUserRequest;
import com.backendbloom.openapi.model.NewUserRequest;
import com.backendbloom.openapi.model.UserBusinessInfoResponse;
import com.example.backendbloom.business.mapper.application.BusinessApplicationOpenApiMapper;
import com.example.backendbloom.business.mapper.business.BusinessOpenApiMapper;
import com.example.backendbloom.business.mapper.review.BusinessReviewOpenApiMapper;
import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.review.BusinessReviewModel;
import com.example.backendbloom.business.service.application.BusinessApplicationService;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.business.service.review.BusinessReviewService;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.user.exception_handler.exception.NewRoleIsNotRegisteredInKeycloak;
import com.example.backendbloom.user.exception_handler.exception.SocialUserAlreadyCreatedException;
import com.example.backendbloom.user.exception_handler.exception.UserAlreadyCreatedKeycloakException;
import com.example.backendbloom.user.exception_handler.exception.UserForNewRoleNotFoundException;
import com.example.backendbloom.user.mapper.AppUserToOpenApiAppUserMapper;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.AppUserRole;
import com.example.backendbloom.user.service.user.AppUserService;
import com.example.backendbloom.user.service.user.KeycloakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import javax.ws.rs.core.Response;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AppUserController implements UsersApi {
    private final AppUserService appUserService;
    private final KeycloakService keycloakService;

    private final BusinessService businessService;

    private final BusinessReviewService businessReviewService;

    private final BusinessApplicationService businessApplicationService;

    private final BusinessOpenApiMapper businessOpenApiMapper;

    private final BusinessReviewOpenApiMapper businessReviewOpenApiMapper;

    private final BusinessApplicationOpenApiMapper businessApplicationOpenApiMapper;
    private final AppUserToOpenApiAppUserMapper appUserToOpenApiAppUserMapper;

    @Override
    public ResponseEntity<AppUser> createUser(@Valid NewUserRequest newUserRequest) {
        try {
            Response response = keycloakService.createKeycloakUser(newUserRequest);
            if (response.getStatus() == 201) {
                AppUserModel newUser = appUserService.createMongoUser(newUserRequest);
                return new ResponseEntity<>(appUserToOpenApiAppUserMapper.toOpenApiAppUserFromEntity(newUser), HttpStatus.CREATED);
            } else if (response.getStatus() == 409) {
                log.info(response.toString());
                throw new UserAlreadyCreatedKeycloakException();
            } else {
                throw new DefaultServerException("Keycloak unable to create user, might be currently unavailable");
            }
        } catch (UserAlreadyCreatedKeycloakException | DefaultServerException |
                 UserForNewRoleNotFoundException | NewRoleIsNotRegisteredInKeycloak exception) {
            throw exception;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed(AppUserRole.Names.CUSTOMER)

    public ResponseEntity<AppUser> createSocialUser(NewSocialUserRequest newSocialUserRequest) {
        try {
            AppUserModel newSocialUser = appUserService.createSocialMongoUser(newSocialUserRequest);
            return new ResponseEntity<>(appUserToOpenApiAppUserMapper.toOpenApiAppUserFromEntity(newSocialUser), HttpStatus.CREATED);
        } catch (SocialUserAlreadyCreatedException | ObjectNotFound | DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }


    @Override
    @RolesAllowed(AppUserRole.Names.CUSTOMER)
    public ResponseEntity<AppUser> getCurrentUserInfo() {
        try {
            String userId = appUserService.getIdOfKeycloakUser();
            AppUserModel currentAppUser = appUserService.getAppUserById(userId);
            return new ResponseEntity<>(appUserToOpenApiAppUserMapper.toOpenApiAppUserFromEntity(currentAppUser)
                    ,HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed(AppUserRole.Names.BUSINESS_OWNER)
    public ResponseEntity<UserBusinessInfoResponse> getCurrentUserBusinessInfo() {
        try {
            String userId = appUserService.getIdOfKeycloakUser();
            AppUserModel currentAppUser = appUserService.getAppUserById(userId);
            BusinessApplicationModel businessApplicationModel = businessApplicationService.getBusinessApplicationById(currentAppUser.getBusinessApplicationId());
            BusinessModel businessModel = businessService.getBusinessModelById(currentAppUser.getBusinessId());
            BusinessReviewModel businessReviewModel = null;
            if (businessApplicationModel.getReviewId() != null) {
                businessReviewModel = businessReviewService.getBusinessReviewModelById(businessApplicationModel.getReviewId());
            }

            UserBusinessInfoResponse userBusinessInfoResponse = new UserBusinessInfoResponse();

            userBusinessInfoResponse.setBusiness(businessOpenApiMapper.businessModelToOpenApi(businessModel));
            userBusinessInfoResponse.setBusinessApplication(businessApplicationOpenApiMapper.businessApplicationToOpenApi(businessApplicationModel));
            userBusinessInfoResponse.setBusinessApplicationReview(businessReviewOpenApiMapper.businessApplicationReviewModelToOpenApi(businessReviewModel));

            return new ResponseEntity<>(userBusinessInfoResponse,HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}



