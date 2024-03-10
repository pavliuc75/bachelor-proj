package com.example.backendbloom.products.service.category_application;

import com.example.backendbloom.products.model.category.CategoryApplicationModel;
import org.springframework.data.domain.Page;

public interface CategoryApplicationService {

    Page<CategoryApplicationModel> getCategoryApplicationList(int pageSize, int pageNumber) throws Exception;

    CategoryApplicationModel createNewCategoryApplicationModel(CategoryApplicationModel categoryApplicationModel) throws Exception;

    CategoryApplicationModel getCategoryApplicationById(String categoryApplicationId) throws Exception;

    String deleteCategoryApplicationById(String categoryApplicationId) throws Exception;
}
