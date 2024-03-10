package com.example.backendbloom.user.repository.order;

import com.example.backendbloom.user.model.order.OrderToFulfillModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderToFulfillRepository extends MongoRepository<OrderToFulfillModel, String> {
    List<OrderToFulfillModel> findByFulfilledBy(String fulfilledBy);

    OrderToFulfillModel findByIdAndFulfilledBy(String orderId, String fulfilledBy);
}
