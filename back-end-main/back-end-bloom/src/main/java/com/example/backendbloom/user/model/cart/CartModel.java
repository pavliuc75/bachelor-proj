package com.example.backendbloom.user.model.cart;

import com.backendbloom.openapi.model.ProductInCart;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import nonapi.io.github.classgraph.json.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document("cart")
public class CartModel {
    @Id
    private String id;
    @Field("products")
    private List<ProductInCartModel> products = new ArrayList<>();

    @JsonProperty("totalElements")
    private Integer totalElements = 0;

    @JsonProperty("totalPrice")
    private BigDecimal totalPrice = BigDecimal.valueOf(0);
}
