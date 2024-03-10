package com.example.backendbloom.business.model.business;

import lombok.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Getter
@Setter
@Document("privateBusinessAnalytics")
public class PrivateBusinessAnalyticsModel {
    @Id
    private String id;
    private String belongsToBusinessId;
    private Integer totalNumberOfCompletedOrders;
    private Integer totalNumberOfOrdersToBeCompleted;
    private BigDecimal totalIncome;
    private Integer totalSoldAmountProducts;
}
