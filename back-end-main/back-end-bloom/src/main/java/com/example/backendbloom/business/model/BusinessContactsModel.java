package com.example.backendbloom.business.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessContactsModel {
    private BigDecimal phoneNumber;

    private String email;

    private String address;

    private String website;

    private String facebook;

    private String instagram;
}
