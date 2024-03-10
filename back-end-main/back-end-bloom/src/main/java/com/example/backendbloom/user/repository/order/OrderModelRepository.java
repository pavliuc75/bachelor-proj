package com.example.backendbloom.user.repository.order;

import com.example.backendbloom.user.model.order.OrderModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface OrderModelRepository extends MongoRepository<OrderModel, String> {
    // placedBy ref the user id
    List<OrderModel> findByPlacedBy(String placedBy);
}
