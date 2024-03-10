package com.example.backendbloom.business.repository;

import com.example.backendbloom.business.model.business.MarketplaceBusinessAnalyticsModel;
import com.example.backendbloom.business.model.review.BusinessReviewModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MarketplaceBusinessAnalyticsRepository extends MongoRepository<MarketplaceBusinessAnalyticsModel,String> {
}
