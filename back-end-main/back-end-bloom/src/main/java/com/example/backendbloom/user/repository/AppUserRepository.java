package com.example.backendbloom.user.repository;

import com.example.backendbloom.user.model.AppUserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface AppUserRepository extends MongoRepository<AppUserModel, String> {
    @Query("{'username': ?0}")
    AppUserModel findByUsername(String username);

    @Query("{'email' : ?0}")
    AppUserModel findByEmail(String email);
}
