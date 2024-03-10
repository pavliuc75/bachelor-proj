package com.example.backendbloom.products.repository;

import com.example.backendbloom.products.model.product.ProductModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProductRepository extends MongoRepository<ProductModel, String> {
    @Query("{'belongsToBusinessId' :  ?0}")
    Page<ProductModel> findBy(String belongsToBusinessId, Pageable page);

    @Query("{'belongsToBusinessId' :  ?0}")
    List<ProductModel> findBy(String belongsToBusinessId);

    Page<ProductModel> findBy(Pageable page);
}
