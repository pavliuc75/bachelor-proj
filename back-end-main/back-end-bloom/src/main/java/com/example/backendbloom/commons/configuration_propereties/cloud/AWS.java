package com.example.backendbloom.commons.configuration_propereties.cloud;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "cloud.aws")
@Configuration
@Getter
@Setter
@Data
@RequiredArgsConstructor
public class AWS {
    private final AWSCredentials awsCredentials;
    private final AWSS3Buckets awss3Bucket;
    private final AWSRegion awsRegion;

}
