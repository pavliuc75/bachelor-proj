package com.example.backendbloom.user.model.order;

import lombok.*;
import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.*;

import java.util.ArrayList;
import java.util.List;

@ToString
@NoArgsConstructor
@Getter
@Setter
@Document("orderToFulfill")
public class OrderToFulfillModel {
    @Id
    private String id;
    List<ProductInOrderModel> productList;
    @Field(targetType = FieldType.OBJECT_ID)
    private String fulfilledBy;
        @Field(targetType = FieldType.OBJECT_ID)
    private String orderedBy;
    private ShippingDetailsModel shippingDetails;
    @CreatedDate
    private DateTime createdDate;
    private OrderStatusModel orderStatus;

    public OrderToFulfillModel(List<ProductInOrderModel> productList, String fulfilledBy, String orderedBy, ShippingDetailsModel shippingDetails, OrderStatusModel orderStatus) {
        this.productList = productList;
        this.fulfilledBy = fulfilledBy;
        this.orderedBy = orderedBy;
        this.shippingDetails = shippingDetails;
        this.orderStatus = orderStatus;
    }
}
