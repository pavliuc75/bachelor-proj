package com.example.backendbloom.products.repository;

import com.example.backendbloom.products.model.product.ProductRatingModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRatingRepository extends MongoRepository<ProductRatingModel, String> {
}
