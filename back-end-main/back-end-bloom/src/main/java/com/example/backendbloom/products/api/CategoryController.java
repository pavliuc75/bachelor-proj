package com.example.backendbloom.products.api;

import com.backendbloom.openapi.api.CategoryApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.products.exception_handler.exception.CategoryNotFound;
import com.example.backendbloom.products.mapper.mappers.CategoryOpenApiMapper;
import com.example.backendbloom.products.model.category.CategoryApplicationModel;
import com.example.backendbloom.products.model.category.CategoryModel;
import com.example.backendbloom.products.service.category.CategoryService;
import com.example.backendbloom.products.service.category_application.CategoryApplicationService;
import com.example.backendbloom.products.service.category_application.CategoryApplicationTransactionalService;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CategoryController implements CategoryApi {

    private final CategoryOpenApiMapper categoryOpenApiMapper;
    private final CategoryService categoryService;
    private final CategoryApplicationService categoryApplicationService;
    private final CategoryApplicationTransactionalService categoryApplicationTransactionalService;

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER, AppUserRole.Names.ADMIN})
    public ResponseEntity<CategoryApplication> createCategoryApplication(CreateCategoryApplicationRequest createCategoryApplicationRequest) {
        try {
            CategoryApplicationModel categoryToCreate = categoryOpenApiMapper.fromCategoryRequest(createCategoryApplicationRequest);
            CategoryApplicationModel categoryApplicationModel = categoryApplicationService.createNewCategoryApplicationModel(categoryToCreate);
            return new ResponseEntity<>(categoryOpenApiMapper.fromCategoryApplicationModel(categoryApplicationModel), HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER, AppUserRole.Names.ADMIN})
    public ResponseEntity<CategoryApplicationListResponse> getCategoryApplicationList(Integer pageSize, Integer pageNumber) {
        try {
            CategoryApplicationListResponse categoryApplicationListResponse = new CategoryApplicationListResponse();
            Page<CategoryApplicationModel> categoryApplicationModelPage = categoryApplicationService.getCategoryApplicationList(pageSize, pageNumber);
            categoryApplicationListResponse.setCategoryApplicationList(categoryOpenApiMapper.fromCategoryApplicationModelList(categoryApplicationModelPage.toList()));
            categoryApplicationListResponse.setTotalAmountOfElements(categoryApplicationModelPage.getTotalElements());
            categoryApplicationListResponse.setTotalAmountOfPage(categoryApplicationModelPage.getTotalPages());
            return new ResponseEntity<>(categoryApplicationListResponse, HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<CategoryListResponse> getCategoryList(Integer pageSize, Integer pageNumber) {
        try {
            CategoryListResponse categoryListResponse = new CategoryListResponse();
            Page<CategoryModel> categoryModelPage = categoryService.getCategoryList(pageSize, pageNumber);
            categoryListResponse.setCategoryList(categoryOpenApiMapper.fromCategoryModelList(categoryModelPage.toList()));
            categoryListResponse.setTotalAmountOfElements(categoryModelPage.getTotalElements());
            categoryListResponse.setTotalAmountOfPage(categoryModelPage.getTotalPages());
            return new ResponseEntity<>(categoryListResponse, HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<Category> handleNewCategoryApplication(HandleCategoryApplicationRequest handleCategoryApplicationRequest) {
        try {
            CategoryModel categoryModel = categoryApplicationTransactionalService.handleCategoryApplication(handleCategoryApplicationRequest.getCategoryId(), categoryOpenApiMapper.fromCategoryResponse(handleCategoryApplicationRequest.getCategoryState()));
            return new ResponseEntity<>(categoryOpenApiMapper.fromCategoryModel(categoryModel), HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<String> deleteCategoryById(String categoryId) {
        try {
            String deletedId = categoryService.deleteCategoryById(categoryId);
            return new ResponseEntity<>(deletedId, HttpStatus.OK);
        } catch (DefaultServerException | CategoryNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<Category> updateCategory(UpdateCategoryRequest updateCategoryRequest) {
        try {
            CategoryModel updatedCategoryModel = categoryService.updateCategory(updateCategoryRequest.getId(), updateCategoryRequest.getCategory());
            return new ResponseEntity<>(categoryOpenApiMapper.fromCategoryModel(updatedCategoryModel), HttpStatus.OK);
        } catch (DefaultServerException | CategoryNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
