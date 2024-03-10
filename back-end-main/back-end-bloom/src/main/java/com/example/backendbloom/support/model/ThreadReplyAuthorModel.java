package com.example.backendbloom.support.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThreadReplyAuthorModel {
    @Field(value = "userId", targetType = FieldType.OBJECT_ID)
    private String userId;

    @Field("email")
    private String email;

    @Field("isCreatorOfTheThread")
    private Boolean isCreatorOfTheThread;
}
