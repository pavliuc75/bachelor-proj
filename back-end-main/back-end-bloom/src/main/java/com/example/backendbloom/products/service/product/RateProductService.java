package com.example.backendbloom.products.service.product;

import com.example.backendbloom.products.exception_handler.exception.ProductNotMeetsRatingCriteria;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.user.model.AppUserModel;

import java.math.BigDecimal;

public interface RateProductService {
    ProductModel rateProduct(String productId, BigDecimal rating) throws ProductNotMeetsRatingCriteria;

}
