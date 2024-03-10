package com.example.backendbloom.products.service.category;

import com.example.backendbloom.products.model.category.CategoryModel;
import org.springframework.data.domain.Page;

public interface CategoryService {
    Page<CategoryModel> getCategoryList(int pageSize, int pageNumber) throws Exception;
    CategoryModel createNewCategoryApplicationModel(CategoryModel categoryModel) throws Exception;
    CategoryModel getCategoryById(String categoryId)throws Exception;

    String deleteCategoryById(String categoryId) throws Exception;

    CategoryModel updateCategory(String categoryId, String newCategoryName) throws Exception;
}
