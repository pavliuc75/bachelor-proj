package com.example.backendbloom.business.repository;

import com.example.backendbloom.business.model.business.PrivateBusinessAnalyticsModel;
import com.example.backendbloom.business.model.business.PublicBusinessAnalyticsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PrivateBusinessAnalyticsRepository extends MongoRepository<PrivateBusinessAnalyticsModel, String> {
    PrivateBusinessAnalyticsModel findByBelongsToBusinessId(String belongsToBusinessId);
}
