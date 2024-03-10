package com.example.backendbloom.user.util.builder;

import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.experimental.UtilityClass;

@UtilityClass
public class AppUserBuilder {
    public static AppUserModel buildCustomerAppUser(String email, String firstName, String LastName, AppUserRole role) {
        AppUserModel newUser = new AppUserModel();
        newUser.setEmail(email);
        newUser.setFirstName(firstName);
        newUser.setLastName(LastName);
        newUser.setUpCustomerUserRole(role);
        return newUser;
    }
}
