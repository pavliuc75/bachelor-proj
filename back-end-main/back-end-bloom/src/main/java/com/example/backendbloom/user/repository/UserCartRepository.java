package com.example.backendbloom.user.repository;

import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.cart.CartModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserCartRepository extends MongoRepository<CartModel, String> {
}
