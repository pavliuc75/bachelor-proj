package com.example.backendbloom.user.model.order;

import com.example.backendbloom.products.model.product.ProductImageModel;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.math.BigDecimal;

public enum OrderStatusModel {
    AWAITING_SHIPMENT,
    READY_FOR_SHIPMENT,
    SHIPPED,
    AWAITING_PICKUP,
    COMPLETED

}
