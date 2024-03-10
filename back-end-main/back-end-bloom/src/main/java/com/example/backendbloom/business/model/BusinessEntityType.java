package com.example.backendbloom.business.model;


public enum BusinessEntityType {
    SRL("S.R.L."),

    SA("S.A."),
    SC("S.C."),
    SNC("S.N.C."),

    OTHER("Other");

    private String value;

    BusinessEntityType(String value) {
        this.value = value;
    }
}
