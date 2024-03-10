package com.example.backendbloom.products.model.product;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRatingModel {
    private Integer fiveStar = 0;
    private Integer fourStar = 0;
    private Integer threeStar = 0;
    private Integer twoStar = 0;
    private Integer oneStar = 0;
    private BigDecimal overallRating = BigDecimal.valueOf(0.0);
    private Integer totalRatings = 0;
}
