package com.example.backendbloom.products.repository;

import com.example.backendbloom.products.model.category.CategoryApplicationModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryApplicationRepository extends MongoRepository<CategoryApplicationModel, String> {
    boolean existsByCategory(String category);
}
