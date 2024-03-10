package com.example.backendbloom.products.model.category;

import lombok.*;
import org.joda.time.DateTime;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Document("category")
public class CategoryModel {
    @Id
    private String id;
    @Field("category")
    private String category;
    @CreatedDate
    @Field("createdDate")
    private DateTime createdDate;
}
