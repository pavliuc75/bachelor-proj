package com.example.backendbloom.user.model.cart;

import com.backendbloom.openapi.model.Product;
import com.example.backendbloom.products.model.product.ProductImageModel;
import com.example.backendbloom.products.model.product.ProductModel;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.math.BigDecimal;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductInCartModel {

    @DocumentReference
    private ProductModel product;
    private Integer amount;
}
