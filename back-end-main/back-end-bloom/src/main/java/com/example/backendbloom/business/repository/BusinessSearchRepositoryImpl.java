package com.example.backendbloom.business.repository;

import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.commons.configuration_propereties.spring.data.MongoDbConfigurationProperties;
import com.example.backendbloom.products.model.product.ProductModel;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@Component
public class BusinessSearchRepositoryImpl implements BusinessSearchRepository{
    private final MongoClient client;
    private final MongoConverter mongoConverter;
    private final MongoDbConfigurationProperties mongoConfigProp;
    MongoDatabase database;

    @PostConstruct
    private void postConstruct() {
        database = client.getDatabase(mongoConfigProp.getDatabase());
    }

    @Override
    public List<BusinessModel> searchBusiness(String text) {
        final List<BusinessModel> foundBusinessList = new ArrayList<>();
        MongoCollection<Document> collection = database.getCollection(mongoConfigProp.getBusinessCollectionName());
        Iterable<Document> result = collection.aggregate(
        Arrays.asList(new Document("$search",
                        new Document("index", "businessSearch")
                                .append("wildcard",
                                        new Document("query", String.format("*%s*", text))
                                                .append("path",
                                                        new Document("wildcard", "*"))
                                                .append("allowAnalyzedField", true))),
                new Document("$match",
                        new Document("businessState", "ACTIVE"))));
        result.forEach(doc -> foundBusinessList.add(mongoConverter.read(BusinessModel.class, doc)));
        return foundBusinessList;
    }
}
