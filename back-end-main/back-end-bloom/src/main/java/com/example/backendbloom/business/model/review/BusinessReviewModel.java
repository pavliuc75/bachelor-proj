package com.example.backendbloom.business.model.review;

import com.example.backendbloom.business.model.review.enums.BusinessReviewState;
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
@Document("businessApplicationReview")
public class BusinessReviewModel {
    @Id
    private String id;
    @Field(value = "BusinessApplicationId", targetType = FieldType.OBJECT_ID)
    private String businessApplicationId;
    @Field(value = "ReviewAuthorId", targetType = FieldType.OBJECT_ID)
    private String ReviewAuthorId;
    @Field("BusinessReviewState")
    private BusinessReviewState businessReviewState;
    @Field("BusinessReviewDescription")
    private String businessReviewDescription;
    @CreatedDate
    @Field("createdDate")
    private DateTime createdDate;
}
