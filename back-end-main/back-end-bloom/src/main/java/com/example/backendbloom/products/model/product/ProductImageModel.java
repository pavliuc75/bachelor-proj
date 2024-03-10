package com.example.backendbloom.products.model.product;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageModel {
    private String imageKey;
    private String imageUrl;
}
