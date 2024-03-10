package com.example.backendbloom.support.repository;

import com.example.backendbloom.support.model.ThreadReplyModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ThreadReplyRepository extends MongoRepository<ThreadReplyModel,String> {
    Page<ThreadReplyModel> findDistinctByParentThreadId(String parentThreadId, PageRequest pageRequest);
}
