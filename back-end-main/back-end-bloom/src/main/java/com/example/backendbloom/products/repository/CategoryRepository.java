package com.example.backendbloom.products.repository;

import com.example.backendbloom.products.model.category.CategoryModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<CategoryModel,String> {
    boolean existsByCategory(String category);

}
