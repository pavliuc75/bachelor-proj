package com.example.backendbloom.integration_tests.model;

import com.backendbloom.openapi.model.NewUserRequest;
import lombok.*;
import java.util.ArrayList;
import java.util.Collection;

@ToString
@NoArgsConstructor
//@AllArgsConstructor
@Getter
@Setter
public class UserModelTest  {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Collection<AppUserRoleModelTest> roles = new ArrayList<>();

    public UserModelTest(String firstName, String lastName, String password,String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    public UserModelTest(String firstName, String lastName, String password, String email, Collection<AppUserRoleModelTest> roles) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    //    public void setUpCustomerUserRole(TestAppUserRoleModel role) {
//        roles.add(role);
//    }
//
//    public UserModelTest(String firstName, String lastName, String password, String email, Collection<AppUserRoleModelTest> roles){
//        firstName(firstName);
//        lastName(lastName);
//        password(password);
//        email(email);
//        this.roles = roles;
//    }
//    public UserModelTest(String firstName, String lastName, String password, String email){
//        firstName(firstName);
//        lastName(lastName);
//        password(password);
//        email(email);
//    }
}
