package com.example.backendbloom.business.model;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessDescriptionModel {
    private String id;
    private String legalName;
    private BusinessEntityType businessEntityType;
    private Long uniqueIdentificationCode;
    private Integer tvaNumber;
    private String companyDescription;

}
