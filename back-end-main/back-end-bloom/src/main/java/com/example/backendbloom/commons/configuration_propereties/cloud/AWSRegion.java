package com.example.backendbloom.commons.configuration_propereties.cloud;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "cloud.aws.region")
@Configuration
@Getter
@Setter
@Data
public class AWSRegion {
    @NotNull
//    @Value("${cloud.aws.region.static}")
    private String Static;
    @NotNull
    private Boolean auto;
}
