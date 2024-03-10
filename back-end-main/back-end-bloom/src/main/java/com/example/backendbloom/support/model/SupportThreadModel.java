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
@Document("SupportThread")
public class SupportThreadModel {
    @Id
    private String supportThreadId;
    @Field(value = "threadAuthorId", targetType = FieldType.OBJECT_ID)
    private String threadAuthorId;
    @Field(value = "threadAuthorEmail")
    private String threadAuthorEmail;
    @Field("threadTopic")
    private String threadTopic;
    @Field("isActive")
    private Boolean isActive;
    @CreatedDate
    @Field
    private DateTime createdDate;
}
