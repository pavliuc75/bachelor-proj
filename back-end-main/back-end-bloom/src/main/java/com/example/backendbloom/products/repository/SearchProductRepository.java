package com.example.backendbloom.products.repository;

import com.example.backendbloom.products.model.product.ProductModel;

import java.util.List;

public interface SearchProductRepository {
    List<ProductModel> searchProductsByNameOrDescription(String text);
    List<ProductModel> autocompleteByProductName(String text, int limitResults);
}
