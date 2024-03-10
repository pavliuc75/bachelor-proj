package com.example.backendbloom.commons.configuration_propereties.cloud;

import com.example.backendbloom.commons.configuration.aws.BusinessS3BucketStructure;
import com.example.backendbloom.commons.configuration.aws.ProductsS3BucketStructure;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties("cloud.aws.s3buckets")
@Configuration
@Getter
@Setter
@Data
public class AWSS3Buckets {
    private String business;
    private String product;
    private final BusinessS3BucketStructure businessS3BucketStructure;
    private final ProductsS3BucketStructure productsS3BucketStructure;
}
