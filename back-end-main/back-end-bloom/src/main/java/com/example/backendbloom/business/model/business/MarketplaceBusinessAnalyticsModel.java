package com.example.backendbloom.business.model.business;

import lombok.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Getter
@Setter
@Document("marketplaceBusinessAnalytics")
public class MarketplaceBusinessAnalyticsModel {
    private BigDecimal totalRevenue;
    private Integer totalNumberOfOrders;
    private Integer totalNumberOfCompletedOrders;
    private Integer totalNumberOfInProgressOrders;
    private Integer totalNumberOfProducts;
    private Integer totalNumberOfCustomers;
    private Integer totalNumberOfBusinesses;
}
