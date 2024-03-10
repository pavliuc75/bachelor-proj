package com.example.backendbloom.commons.configuration_propereties.spring.data;


import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "spring.data.mongodb")
@Configuration
@Getter
@Setter
@Data
@RequiredArgsConstructor
public class MongoDbConfigurationProperties {
    @NotNull
    private String uri;
    @NotNull
    private String database;
    private String businessCollectionName = "business";
    private String orderCollectionName = "order";
    private String productCollectionName = "product";
}
