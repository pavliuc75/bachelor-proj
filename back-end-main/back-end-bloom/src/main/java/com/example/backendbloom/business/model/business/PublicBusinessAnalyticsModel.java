package com.example.backendbloom.business.model.business;


import lombok.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.math.BigDecimal;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Getter
@Setter
@Document("publicBusinessAnalytics")
public class PublicBusinessAnalyticsModel {
    @Id
    private String id;
    private Integer soldProductsTotal;
    private BigDecimal averageProductRating;
    @Field(targetType = FieldType.OBJECT_ID)
    private String belongsToBusinessId;
}
