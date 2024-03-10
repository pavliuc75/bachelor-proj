package com.example.backendbloom.business.repository;

import com.example.backendbloom.business.model.business.PublicBusinessAnalyticsModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PublicBusinessAnalyticsRepository extends MongoRepository<PublicBusinessAnalyticsModel, String> {
    PublicBusinessAnalyticsModel findByBelongsToBusinessId(String belongsToBusinessId);
}
