package com.example.backendbloom.products.mapper.mappers;

import com.backendbloom.openapi.model.Category;
import com.backendbloom.openapi.model.CategoryApplication;
import com.backendbloom.openapi.model.CategoryApplicationResponse;
import com.backendbloom.openapi.model.CreateCategoryApplicationRequest;
import com.example.backendbloom.products.model.category.CategoryApplicationModel;
import com.example.backendbloom.products.model.category.CategoryModel;
import com.example.backendbloom.products.model.category.enums.CategoryApplicationResponseState;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface CategoryOpenApiMapper {
    Category fromCategoryModel(CategoryModel category);

    List<Category> fromCategoryModelList(List<CategoryModel> categoryModelList);

    CategoryApplicationResponseState fromCategoryResponse(CategoryApplicationResponse categoryApplicationResponse);
    CategoryApplication fromCategoryApplicationModel(CategoryApplicationModel categoryApplicationModel);

    List<CategoryApplication> fromCategoryApplicationModelList(List<CategoryApplicationModel> categoryApplicationModelList);
    CategoryApplicationModel fromCategoryRequest(CreateCategoryApplicationRequest createCategoryApplicationRequest);
}
