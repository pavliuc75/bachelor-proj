package com.example.backendbloom.business.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessPaymentDetailsModel {
    private String iban;

    private String bank;

    private String swiftCode;
}
