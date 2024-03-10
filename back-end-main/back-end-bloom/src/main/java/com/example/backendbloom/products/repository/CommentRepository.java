package com.example.backendbloom.products.repository;

import com.example.backendbloom.products.model.comment.CommentModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends MongoRepository<CommentModel,String>{
    Optional<List<CommentModel>> findDistinctByProductTreeId(String productTreeId);
}
