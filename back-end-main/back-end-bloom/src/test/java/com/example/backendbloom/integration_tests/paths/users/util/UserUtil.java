package com.example.backendbloom.integration_tests.paths.users.util;

import com.example.backendbloom.integration_tests.model.AppUserRoleModelTest;
import com.example.backendbloom.integration_tests.model.UserModelTest;

import java.util.Collections;
import java.util.UUID;

public class UserUtil {
    /**
     * Creates new user request object with unique email address
     */
    public static UserModelTest createUniqueUserWithoutRoles(){
        String uniqueEmail = String.format("%s_sobaka@email.xyz", UUID.randomUUID());
        return new UserModelTest("Ivan", "Ivanov", "Secret123",uniqueEmail);
    }
    public static UserModelTest createUniqueUserWithCustomerRole(){
        String uniqueEmail = String.format("%s_customer@email.xyz", UUID.randomUUID());
        return new UserModelTest("Ivan", "Ivanov", "Secret123",uniqueEmail, Collections.singleton(AppUserRoleModelTest.CUSTOMER));
    }
}
