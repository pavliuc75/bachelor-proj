package com.example.backendbloom.business.repository;

import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BusinessRepository extends MongoRepository<BusinessModel,String> {
    @Query("{'businessState' :  ?0}")
    Page<BusinessModel> findBy(BusinessState BusinessState, Pageable page);
    @Query("{'businessState' :  ?0}")
    List<BusinessModel> findBy(BusinessState BusinessState);
}