package com.example.backendbloom.support.model;

import lombok.*;
import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;



@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Configuration
@Document("ThreadReply")
public class ThreadReplyModel {
    @Id
    private String threadReplyId;
    @Field(value = "parentThreadId",targetType = FieldType.OBJECT_ID)
    private String parentThreadId;
    @Field(value="author")
    private ThreadReplyAuthorModel author;
    @Field(value = "text")
    private String text;
    @CreatedDate
    @Field("createdDate")
    private DateTime createdDate;
}
