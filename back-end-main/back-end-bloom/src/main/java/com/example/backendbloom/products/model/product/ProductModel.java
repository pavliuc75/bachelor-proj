package com.example.backendbloom.products.model.product;

import lombok.*;

import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.math.BigDecimal;
import java.util.List;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document("product")
public class ProductModel {

    @Id
    private String id;
    @Field (name="belongsToBusinessId", targetType = FieldType.OBJECT_ID)
    private String belongsToBusinessId;
    @Field (name="categoryId", targetType = FieldType.OBJECT_ID)
    private String categoryId;
    @Field("name")
    private String name;

    @Field("price")
    private BigDecimal price;

    @Field("description")
    private String description;
    private ProductRatingModel rating = new ProductRatingModel();

//    @Field("totalRatings")
//    private Integer totalRatings = 0;

    @Field("listedDate")
    @CreatedDate
    private DateTime listedDate;

    @Field("stockAmount")
    private Integer stockAmount;

    @Field("totalSold")
    private Integer totalSold = 0;

    @Field("mainImage")
    private ProductImageModel mainImage;

    @Field("additionalImages")
    private List<ProductImageModel> additionalImages = null;

}
