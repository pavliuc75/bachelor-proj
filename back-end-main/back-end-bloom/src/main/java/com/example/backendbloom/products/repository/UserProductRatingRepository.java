package com.example.backendbloom.products.repository;

import com.example.backendbloom.products.model.product.UserProductRatingModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserProductRatingRepository extends MongoRepository<UserProductRatingModel, String> {
}
