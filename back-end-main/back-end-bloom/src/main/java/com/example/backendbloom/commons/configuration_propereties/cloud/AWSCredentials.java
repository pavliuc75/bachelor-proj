package com.example.backendbloom.commons.configuration_propereties.cloud;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "cloud.aws.credentials")
@Configuration
@Getter
@Setter
@Data
public class AWSCredentials {
    @NotNull
    private String accessKey;
    @NotNull
    private String secretKey;
}
