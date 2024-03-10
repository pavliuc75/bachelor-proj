package com.example.backendbloom.commons.configuration.aws;

import lombok.Getter;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
/**
 * Defines paths for S3 bucket
 */
public class ProductsS3BucketStructure {
    private final String businessPath = "business";
    private final String products = "products";
    private final String logo = "logo";

    public String buildProductsPath(String username) {
        return String.format("%s/%s/%s", businessPath, username, products);
    }
    public String buildLogoPath(String username) {
        return String.format("%s/%s/%s", businessPath, username, logo);
    }
}
