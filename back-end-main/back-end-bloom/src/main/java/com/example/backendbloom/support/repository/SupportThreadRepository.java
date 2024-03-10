package com.example.backendbloom.support.repository;

import com.example.backendbloom.support.model.SupportThreadModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SupportThreadRepository extends MongoRepository<SupportThreadModel,String> {
    Optional<SupportThreadModel> findFirstByThreadAuthorIdAndIsActive(String threadAuthorId, Boolean isActive);
    Page<SupportThreadModel> getAllByIsActive(boolean isActive, PageRequest pageRequest);
    Page<SupportThreadModel> findAllByThreadAuthorIdAndIsActive(String threadAuthorId, Boolean isActive, PageRequest pageRequest);
    Optional<SupportThreadModel> findBySupportThreadIdAndIsActive(String supportTreadId, boolean isActive);
}
