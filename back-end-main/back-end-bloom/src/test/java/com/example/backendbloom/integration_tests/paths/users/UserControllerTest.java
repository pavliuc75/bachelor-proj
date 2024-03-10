package com.example.backendbloom.integration_tests.paths.users;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsInRelativeOrder;
import static org.hamcrest.Matchers.equalTo;

import com.backendbloom.openapi.model.NewUserRequest;
import com.example.backendbloom.integration_tests.keycloak.KeycloakTestContainers;
import com.example.backendbloom.integration_tests.model.UserModelTest;
import com.example.backendbloom.integration_tests.paths.users.util.UserUtil;
import io.restassured.http.ContentType;
import lombok.var;
import org.junit.jupiter.api.Test;

class UserControllerTest extends KeycloakTestContainers {
    private final String basePath = "/users";
    private final String createCustomerPath = basePath + "/create-customer";
    private final String createSocialCustomerPath = basePath + "/create-social-customer";

    @Test
    void postCreateUser_shouldReturnCreatedUser() {
//        Arrange
        UserModelTest testUserModel = UserUtil.createUniqueUserWithoutRoles();
//        Act & Assert
        given().when().contentType(ContentType.JSON)
                .body(testUserModel)
                .post(createCustomerPath)
                .then().statusCode(201)
                .body("email", equalTo(testUserModel.getEmail()))
                .body("firstName", equalTo(testUserModel.getFirstName()))
                .body("lastName", equalTo(testUserModel.getLastName()));
    }

    @Test
    void PostCreateUser_userAlreadyCreated_shouldReturn409() {
//        Arrange
        UserModelTest testUserModel = UserUtil.createUniqueUserWithoutRoles();
//        Act & Assert
        given().when().contentType(ContentType.JSON)
                .body(testUserModel)
                .post(createCustomerPath)
                .then().statusCode(201);
//        Attempt to create same user
        given().when().contentType(ContentType.JSON)
                .body(testUserModel)
                .post(createCustomerPath)
                .then().statusCode(409);
    }

    @Test
    void PostCreateUser_NoEmailInBody_shouldReturnError() {
//        Arrange
        UserModelTest newUser = UserUtil.createUniqueUserWithoutRoles();
        newUser.setEmail(null);
//        Act & Assert
        var r = given().when().contentType(ContentType.JSON)
                .body(newUser)
                .post(createCustomerPath);
        System.out.println();
        //TODO NOT IMPLEMENTED
    }

    @Test
    void PostCreateUser_NoPasswordInBody_shouldReturnError() {
//TODO NOT IMPLEMENTED
    }

    @Test
    void PostCreateSocialCustomer_UserNotAuthWithCustomerRole_shouldReturn401() {
//        Arrange
        UserModelTest testUserModel = UserUtil.createUniqueUserWithoutRoles();
        given().when().contentType(ContentType.JSON)
                .body(testUserModel)
                .post(createCustomerPath);
//        Act & Assert
        given().when().contentType(ContentType.JSON)
                .body(testUserModel)
                .post(createSocialCustomerPath)
                .then().statusCode(401);
    }

    @Test
    void PostCreateSocialCustomer_UserCreatedInKeycloakAndInMongo_shouldReturn409() {
//        Arrange
        UserModelTest user = UserUtil.createUniqueUserWithCustomerRole();
        given().when().contentType(ContentType.JSON)
                .body(user)
                .post(createCustomerPath);
//        Act & Assert
        given().header("Authorization", getUserToken(user))
                .when().contentType(ContentType.JSON)
                .body(user)
                .post(createSocialCustomerPath)
                .then().statusCode(409);
    }

    @Test
    void PostCreateSocialCustomer_UserCreatedInKeycloakButNotInMongo_shouldReturnCreateUser() {
//        Arrange

        UserModelTest user = UserUtil.createUniqueUserWithCustomerRole();
        getUserFactory().createKeycloakUser(user);
//        Act & Assert
        given().header("Authorization", getUserToken(user))
                .when().contentType(ContentType.JSON)
                .body(user)
                .post(createSocialCustomerPath)
                .then().statusCode(201)
                .body("email", equalTo(user.getEmail()))
                .body("firstName", equalTo(user.getFirstName()))
                .body("lastName", equalTo(user.getLastName()));
    }
//    @Test
//    void givenAuthenticatedUser_whenPostCreateSocialUser_shouldReturnCreatedUser() {
//        var a = getJaneDoeBearer();
//        given().header("Authorization", getJaneDoeBearer())
//                .when()
//                .get("/users/me")
//                .then()
//                .body("username", equalTo("janedoe"))
//                .body("lastname", equalTo("Doe"))
//                .body("firstname", equalTo("Jane"))
//                .body("email", equalTo("jane.doe@baeldung.com"));
//    }
}
