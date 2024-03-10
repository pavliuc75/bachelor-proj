package com.example.backendbloom.products.service.category_application;


import com.example.backendbloom.products.model.category.CategoryModel;
import com.example.backendbloom.products.model.category.enums.CategoryApplicationResponseState;

public interface CategoryApplicationTransactionalService {
    CategoryModel handleCategoryApplication(String categoryApplicationId, CategoryApplicationResponseState categoryApplicationResponseState) throws Exception;
}
