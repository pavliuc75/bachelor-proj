package com.example.backendbloom.integration_tests.model;

public enum AppUserRoleModelTest {
    BUSINESS_OWNER(Names.BUSINESS_OWNER),
    CUSTOMER(Names.CUSTOMER),
    ADMIN(Names.ADMIN);

    public class Names {
        public static final String BUSINESS_OWNER = "BUSINESS_OWNER";
        public static final String CUSTOMER = "CUSTOMER";
        public static final String ADMIN = "ADMIN";
    }

    private final String label;

    private AppUserRoleModelTest(String label) {
        this.label = label;
    }

    public String toString() {
        return this.label;
    }
}
