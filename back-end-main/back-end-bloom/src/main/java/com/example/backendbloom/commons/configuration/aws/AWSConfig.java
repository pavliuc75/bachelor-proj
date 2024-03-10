package com.example.backendbloom.commons.configuration.aws;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.example.backendbloom.commons.configuration_propereties.CloudConfigurationProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class AWSConfig {
    private final CloudConfigurationProperties cloudConfigurationProperties;
    @Bean
    public AWSCredentials credentials() {
        return new BasicAWSCredentials(
                cloudConfigurationProperties.getAws().getAwsCredentials().getAccessKey(),
                cloudConfigurationProperties.getAws().getAwsCredentials().getSecretKey()
        );
    }
    @Bean
    public AmazonS3 amazonS3() {
        return AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials()))
                .withRegion(Regions.EU_NORTH_1)
                .build();
    }
}
