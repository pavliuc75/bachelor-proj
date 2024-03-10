package com.example.backendbloom.user.repository;

import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.model.wishlist.WishlistModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WishlistRepository extends MongoRepository<WishlistModel, String> {
}
