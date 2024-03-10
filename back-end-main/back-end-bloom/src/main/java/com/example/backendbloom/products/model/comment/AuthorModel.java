package com.example.backendbloom.products.model.comment;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorModel {
    @Field(value = "userId", targetType = FieldType.OBJECT_ID)
    private String userId;

    @Field("email")
    private String email;

    @Field("isProductOwner")
    private Boolean isProductOwner;
}
