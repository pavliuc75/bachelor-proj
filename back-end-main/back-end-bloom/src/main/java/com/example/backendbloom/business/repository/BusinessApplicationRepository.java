package com.example.backendbloom.business.repository;

import com.backendbloom.openapi.model.BusinessApplicationState;
import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface BusinessApplicationRepository extends MongoRepository<BusinessApplicationModel, String> {

    @Query("{'businessApplicationState' :  ?0}")
    Page<BusinessApplicationModel> findBy(BusinessApplicationState businessApplicationState, Pageable page);
}
