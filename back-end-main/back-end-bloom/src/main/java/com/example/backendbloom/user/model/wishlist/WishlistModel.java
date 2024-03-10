package com.example.backendbloom.user.model.wishlist;

import com.example.backendbloom.products.model.product.ProductModel;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.ArrayList;
import java.util.List;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document("wishlist")
public class WishlistModel {
    @Id
    private String id;
    @DocumentReference
    private List<ProductModel> wishlist = new ArrayList<>();
}
