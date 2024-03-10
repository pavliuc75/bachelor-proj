package com.example.backendbloom.products.repository;

import com.example.backendbloom.commons.configuration_propereties.spring.data.MongoDbConfigurationProperties;
import com.example.backendbloom.products.model.product.ProductModel;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.Arrays;

import org.bson.Document;

import javax.annotation.PostConstruct;

@Component
@RequiredArgsConstructor
public class SearchProductRepositoryImpl implements SearchProductRepository {
    private final MongoClient client;
    private final MongoConverter mongoConverter;
    private final MongoDbConfigurationProperties mongoConfigProp;
    MongoDatabase database;

    @PostConstruct
    private void postConstruct() {
        database = client.getDatabase(mongoConfigProp.getDatabase());
    }

    @Override
    public List<ProductModel> searchProductsByNameOrDescription(String text) {
        final List<ProductModel> products = new ArrayList<>();
        MongoCollection<Document> collection = database.getCollection(mongoConfigProp.getProductCollectionName());
        Iterable<Document> result = collection.aggregate(
                Arrays.asList(new Document("$search",
                        new Document("index", "productSearch")
                                .append("wildcard",
                                        new Document("query", String.format("*%s*", text))
                                                .append("path",
                                                        new Document("wildcard", "*"))
                                                .append("allowAnalyzedField", true)))));
        result.forEach(doc -> products.add(mongoConverter.read(ProductModel.class, doc)));
        return products;
    }

    @Override
    public List<ProductModel> autocompleteByProductName(String text, int limitResults) {
        final List<ProductModel> products = new ArrayList<>();
        MongoDatabase database = client.getDatabase(mongoConfigProp.getDatabase());
        MongoCollection<Document> collection = database.getCollection(mongoConfigProp.getProductCollectionName());
        Iterable<Document> result = collection.aggregate(
                Arrays.asList(new Document("$search",
                                new Document("index", "productSearch")
                                        .append("autocomplete",
                                                new Document("query", text)
                                                        .append("path", "name")
                                                        .append("tokenOrder", "sequential"))),
                        new Document("$limit", (long) limitResults),
                        new Document("$project",
                                new Document("name", 1L)
                                        .append("mainImage", 1L)
                                        .append("rating", 1L)
                                        .append("price", 1L))));
        result.forEach(doc -> products.add(mongoConverter.read(ProductModel.class, doc)));
        return products;
    }
}
