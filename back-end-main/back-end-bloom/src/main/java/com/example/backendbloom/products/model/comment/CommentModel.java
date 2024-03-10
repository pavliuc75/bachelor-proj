package com.example.backendbloom.products.model.comment;

import lombok.*;

import org.joda.time.DateTime;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.List;


@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Document("Comments")
public class CommentModel {
    @Id
    private String commentNodeId;
    @Field(value = "productId",targetType = FieldType.OBJECT_ID)
    private String productTreeId;
    @Field("author")
    private AuthorModel author;
    @Field("text")
    private String text;
    @Field(value = "parentId")
    private String parentId;
    @Field("descendants")
    private List<CommentModel> descendants;
    @CreatedDate
    @Field("createdDate")
    private DateTime createdDate;
}
