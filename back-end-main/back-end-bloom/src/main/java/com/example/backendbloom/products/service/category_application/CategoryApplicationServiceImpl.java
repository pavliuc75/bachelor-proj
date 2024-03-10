package com.example.backendbloom.products.service.category_application;

import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.products.model.category.CategoryApplicationModel;
import com.example.backendbloom.products.repository.CategoryApplicationRepository;
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
public class CategoryApplicationServiceImpl implements CategoryApplicationService {
    private final CategoryApplicationRepository categoryApplicationRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<CategoryApplicationModel> getCategoryApplicationList(int pageSize, int pageNumber) throws Exception {
        return categoryApplicationRepository.findAll(PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdDate")));
    }

    @Override
    public CategoryApplicationModel createNewCategoryApplicationModel(CategoryApplicationModel categoryApplicationModel) throws Exception {
        if (categoryApplicationRepository.existsByCategory(categoryApplicationModel.getCategory()) ||
                categoryRepository.existsByCategory(categoryApplicationModel.getCategory())){
            throw new DefaultServerException("Category application already exists or actual category exists");
        }
        return categoryApplicationRepository.save(categoryApplicationModel);
    }

    @Override
    public CategoryApplicationModel getCategoryApplicationById(String categoryApplicationId) throws Exception {
        Optional<CategoryApplicationModel> categoryApplicationModel = categoryApplicationRepository.findById(categoryApplicationId);
        if (categoryApplicationModel.isPresent())
            return categoryApplicationModel.get();
        else throw new DefaultServerException("Category application with given id is not found");
        //TODO: throw custom exception
    }

    @Override
    public String deleteCategoryApplicationById(String categoryApplicationId) throws Exception {
        categoryApplicationRepository.deleteById(categoryApplicationId);
        return categoryApplicationId;
    }
}
