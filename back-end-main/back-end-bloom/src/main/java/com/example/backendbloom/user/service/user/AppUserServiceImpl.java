package com.example.backendbloom.user.service.user;

import com.backendbloom.openapi.model.NewSocialUserRequest;
import com.backendbloom.openapi.model.NewUserRequest;
import com.example.backendbloom.commons.configuration.KeycloakAuthorizedUser;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.user.exception_handler.exception.SocialUserAlreadyCreatedException;
import com.example.backendbloom.user.exception_handler.exception.UserNotHaveBusiness;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.AppUserRole;
import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.model.wishlist.WishlistModel;
import com.example.backendbloom.user.repository.UserCartRepository;
import com.example.backendbloom.user.repository.WishlistRepository;
import com.example.backendbloom.user.util.builder.AppUserBuilder;
import com.example.backendbloom.user.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserServiceImpl implements AppUserService, UserBusinessService {
    private final AppUserRepository appUserRepository;
    private final KeycloakAuthorizedUser keycloakAuthorizedUser;

    private final KeycloakService keycloakService;
    private final UserCartRepository userCartRepository;
    private final WishlistRepository wishlistRepository;


    @Override
    public AppUserModel createMongoUser(NewUserRequest newUserRequest) {
        AppUserModel newUser = AppUserBuilder.buildCustomerAppUser(newUserRequest.getEmail(),
                newUserRequest.getFirstName(),
                newUserRequest.getLastName(),
                AppUserRole.CUSTOMER);
        CartModel userCart = userCartRepository.save(new CartModel());
        WishlistModel wishlist = wishlistRepository.save(new WishlistModel());
        newUser.setCart(userCart);
        newUser.setWishlist(wishlist);
        appUserRepository.save(newUser);
        return appUserRepository.findByEmail(newUser.getEmail());
    }

    @Override
    public AppUserModel createSocialMongoUser(NewSocialUserRequest newSocialUserRequest) {
        String currentUserUsername = keycloakAuthorizedUser.getUserEmail();
        if (appUserRepository.findByEmail(currentUserUsername) == null) {
            AppUserModel newUser = AppUserBuilder.buildCustomerAppUser(currentUserUsername,
                    newSocialUserRequest.getFirstName(),
                    newSocialUserRequest.getLastName(),
                    AppUserRole.CUSTOMER);
            CartModel userCart = userCartRepository.save(new CartModel());
            WishlistModel wishlist = wishlistRepository.save(new WishlistModel());
            newUser.setCart(userCart);
            newUser.setWishlist(wishlist);
            appUserRepository.save(newUser);
            return appUserRepository.findByEmail(newUser.getEmail());
        } else {
            throw new SocialUserAlreadyCreatedException();
        }
    }

    @Override
    public Boolean verifyKeycloakUserById(String userId) {
        String currentUserEmail = keycloakAuthorizedUser.getUserEmail();
        AppUserModel keycloakUser = appUserRepository.findByEmail(currentUserEmail);
        if (keycloakUser != null) {
            return userId.equals(keycloakUser.getId());
        } else {
            throw new DefaultServerException("User with given id can not be found");
            //TODO: throw an custom exception here
        }
    }

    @Override
    public String getIdOfKeycloakUser() {
        String currentUserEmail = keycloakAuthorizedUser.getUserEmail();
        AppUserModel keycloakUser = appUserRepository.findByEmail(currentUserEmail);
        if (keycloakUser != null) {
            return keycloakUser.getId();
        } else {
            throw new ObjectNotFound("Keycloak user",currentUserEmail);
        }
    }

    @Override
    public AppUserModel setUserBusinessInformation(String userId, String businessApplicationId, String businessId) throws Exception {
        AppUserModel appUserResult = getAppUserById(userId);
        if (appUserResult.getBusinessApplicationId() != null || appUserResult.getBusinessId() != null) {
            throw new DefaultServerException("Business was already created for this user");
        }
        appUserResult.setBusinessId(businessId);
        appUserResult.setBusinessApplicationId(businessApplicationId);
        keycloakService.addRealmRoleToUser(appUserResult.getEmail(),AppUserRole.BUSINESS_OWNER.toString());
        //TODO:MAYBE Change to email on keycloak side
        return appUserRepository.save(appUserResult);
    }

    @Override
    public AppUserModel getAppUserById(String userId) throws ObjectNotFound{
        Optional<AppUserModel> appUserResponse = appUserRepository.findById(userId);
        if(!appUserResponse.isPresent()) {
            throw new ObjectNotFound("User",userId);
        }
        return appUserResponse.get();
    }

    @Override
    public String getUserBusinessId() throws UserNotHaveBusiness {
        String userId = getIdOfKeycloakUser();
        String userBusinessId = getAppUserById(userId).getBusinessId();
        if (userBusinessId == null || userBusinessId.length() == 0){
            throw new UserNotHaveBusiness(keycloakAuthorizedUser.getUserEmail());
        }
        return userBusinessId;
    }

    @Override
    public AppUserModel getCurrentUser() {
        String currentUserEmail = keycloakAuthorizedUser.getUserEmail();
        return appUserRepository.findByEmail(currentUserEmail);
    }

    @Override
    public Set<String> getCurrentUserRoles() {
        return keycloakAuthorizedUser.getUserRoles();
    }

    @Override
    public AppUserModel updateUser(AppUserModel appUser) {
        return appUserRepository.save(appUser);
    }

    @Override
    public List<AppUserModel> getCustomersList() {
        return appUserRepository.findAll();
    }

    @Override
    public boolean isUserAdmin() {
        Set<String> userRoles = keycloakAuthorizedUser.getUserRoles();
        boolean userIsAdmin = false;
        for (String userRole : userRoles) {
            if (userRole.equals(AppUserRole.Names.ADMIN)) {
                userIsAdmin = true;
                break;
            }
        }
        return userIsAdmin;
    }

    @Override
    public AppUserModel getAppUserByEmail(String email) {
        return appUserRepository.findByEmail(email);
    }
}