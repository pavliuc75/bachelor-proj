package com.example.backendbloom.business.repository;

import com.example.backendbloom.business.model.review.BusinessReviewModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BusinessReviewRepository extends MongoRepository<BusinessReviewModel,String> {
}
