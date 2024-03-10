package com.example.backendbloom.products.service.category_application;

import com.example.backendbloom.products.model.category.CategoryApplicationModel;
import com.example.backendbloom.products.model.category.CategoryModel;
import com.example.backendbloom.products.model.category.enums.CategoryApplicationResponseState;
import com.example.backendbloom.products.service.category.CategoryService;
import com.example.backendbloom.products.util.builder.CategoryBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryApplicationTransactionalServiceImpl implements CategoryApplicationTransactionalService {

    private final CategoryApplicationService categoryApplicationService;
    private final CategoryService categoryService;

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public CategoryModel handleCategoryApplication(String categoryApplicationId, CategoryApplicationResponseState categoryApplicationResponseState) throws Exception {
         CategoryApplicationModel categoryApplicationModel = categoryApplicationService.getCategoryApplicationById(categoryApplicationId);
         switch (categoryApplicationResponseState) {
             case APPROVE:
                 CategoryModel newCategory = CategoryBuilder.buildCategoryFromApplication(categoryApplicationModel);
                 categoryApplicationService.deleteCategoryApplicationById(categoryApplicationId);
                 return categoryService.createNewCategoryApplicationModel(newCategory);
             case DENY:
                 categoryApplicationService.deleteCategoryApplicationById(categoryApplicationId);
                 return null;
             default: return null;
         }
    }
}
