package com.example.backendbloom.business.model.application;

import com.example.backendbloom.business.model.*;
import com.example.backendbloom.business.model.application.enums.BusinessApplicationState;
import lombok.*;
import org.joda.time.DateTime;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Getter
@Setter
@Document("businessApplication")
public class BusinessApplicationModel {
    @Id
    private String id;
    @Field(value = "createdBusinessId", targetType = FieldType.OBJECT_ID)
    private String createdBusinessId;
    @Field(value = "creatorUserId", targetType = FieldType.OBJECT_ID)
    private String creatorUserId;
    @Field(value = "reviewId", targetType = FieldType.OBJECT_ID)
    private String reviewId;
    @Field("businessApplicationState")
    private BusinessApplicationState businessApplicationState;
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
    @Field("createdDate")
    private DateTime createdDate;

}
