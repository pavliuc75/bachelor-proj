package com.example.backendbloom.user.model.order;

import lombok.*;
import nonapi.io.github.classgraph.json.Id;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.*;

import java.util.List;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document("order")
public class OrderModel {
    @Id
    private String id;
    @DocumentReference
    private List<OrderToFulfillModel> orderItems;
//    @DocumentReference(lazy = true)
@Field(targetType = FieldType.OBJECT_ID)
    private String placedBy;
    private OrderStatusModel orderStatus;
    private ShippingDetailsModel shippingDetails;
    @CreatedDate
    private DateTime createdDate;

    public OrderModel(List<OrderToFulfillModel> orderItems, String placedBy, OrderStatusModel orderStatus, ShippingDetailsModel shippingDetails) {
        this.orderItems = orderItems;
        this.placedBy = placedBy;
        this.orderStatus = orderStatus;
        this.shippingDetails = shippingDetails;
    }
}
