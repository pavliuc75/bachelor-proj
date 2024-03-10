package com.example.backendbloom.user.model;

import com.example.backendbloom.products.model.product.UserProductRatingModel;
import com.example.backendbloom.user.model.cart.CartModel;
import com.example.backendbloom.user.model.wishlist.WishlistModel;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document("appUser")
public class AppUserModel {
    @Id
    private String id;

    @Field("name")
    private String firstName;

    @Field("lastName")
    private String lastName;

    @Field("email")
    private String email;

    @Field(value = "businessApplicationId", targetType = FieldType.OBJECT_ID)
    private String businessApplicationId;

    @Field(value = "businessId", targetType = FieldType.OBJECT_ID)
    private String businessId;

    @Field("roles")
    private Collection<AppUserRole> roles = new ArrayList<>();
    @Field("cart")
    @DocumentReference
    private CartModel cart;
    @Field("wishlist")
    @DocumentReference
    private WishlistModel wishlist;
    private List<UserProductRatingModel> ratedProductList = new ArrayList<>();
    public void setUpCustomerUserRole(AppUserRole role) {
        roles.add(role);
    }
}
