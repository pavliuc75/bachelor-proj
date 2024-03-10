package com.example.backendbloom.products.util.builder;

import com.example.backendbloom.products.model.category.CategoryApplicationModel;
import com.example.backendbloom.products.model.category.CategoryModel;
import lombok.experimental.UtilityClass;

@UtilityClass
public class CategoryBuilder {
    public static CategoryModel buildCategoryFromApplication(CategoryApplicationModel categoryApplicationModel) {
        CategoryModel newCategory = new CategoryModel();
        newCategory.setCategory(categoryApplicationModel.getCategory());
        return newCategory;
    }
}
