package com.example.backendbloom.user.model.order;

import com.example.backendbloom.products.model.product.ProductImageModel;
import com.example.backendbloom.user.model.cart.ProductInCartModel;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.math.BigDecimal;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductInOrderModel {
//    @Field(targetType = FieldType.OBJECT_ID)
    private String id;
    private String name;
    private BigDecimal price;
    private String description;
    private ProductImageModel mainImage;
    private Integer amount;
    private OrderStatusModel orderStatus;
}
