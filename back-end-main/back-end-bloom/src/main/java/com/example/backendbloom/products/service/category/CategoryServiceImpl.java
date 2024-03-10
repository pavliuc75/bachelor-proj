package com.example.backendbloom.products.service.category;

import com.example.backendbloom.products.exception_handler.exception.CategoryNotFound;
import com.example.backendbloom.products.model.category.CategoryModel;
import com.example.backendbloom.products.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Page<CategoryModel> getCategoryList(int pageSize, int pageNumber) throws Exception {
        return categoryRepository.findAll(PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdDate")));
    }

    @Override
    public CategoryModel createNewCategoryApplicationModel(CategoryModel categoryModel) throws Exception {
        return categoryRepository.save(categoryModel);
    }

    @Override
    public CategoryModel getCategoryById(String categoryId) throws Exception {
        Optional<CategoryModel> foundCategory = categoryRepository.findById(categoryId);
        if (foundCategory.isPresent())
            return foundCategory.get();
        else throw new CategoryNotFound(categoryId);
    }

    @Override
    public String deleteCategoryById(String categoryId) throws Exception {
        CategoryModel categoryModel = getCategoryById(categoryId);
        categoryRepository.delete(categoryModel);
        return categoryId;
    }

    @Override
    public CategoryModel updateCategory(String categoryId, String newCategoryName) throws Exception {
        CategoryModel categoryToUpdate = getCategoryById(categoryId);
        categoryToUpdate.setCategory(newCategoryName);
        return categoryRepository.save(categoryToUpdate);
    }
}
