package com.example.backendbloom.business.model.business;

import com.example.backendbloom.business.model.*;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import lombok.*;
import org.joda.time.DateTime;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Getter
@Setter
@Document("business")
public class BusinessModel {
    @Id
    private String id;
    @Field(value = "ownerUserId", targetType = FieldType.OBJECT_ID)
    private String ownerUserId;
    @Field("businessState")
    private BusinessState businessState;
    @Field("businessDescription")
    private BusinessDescriptionModel businessDescription;
    @Field("businessLegalDocuments")
    private BusinessLegalDocumentsModel businessLegalDocuments;
    @Field("businessPaymentDetails")
    private BusinessPaymentDetailsModel businessPaymentDetails;
    @Field("businessContacts")
    private BusinessContactsModel businessContacts;
    @Field("businessLogoModel")
    private BusinessLogoModel businessLogo;
    @CreatedDate
    private DateTime createdDate;
    @LastModifiedDate
    private DateTime lastModifiedDate;
}

