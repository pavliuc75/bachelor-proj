package com.example.backendbloom.products.model.product;

import lombok.*;

import java.math.BigDecimal;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProductRatingModel {
    private String ratedBy;
    private BigDecimal rating;
    private String ratedProductId;
}
