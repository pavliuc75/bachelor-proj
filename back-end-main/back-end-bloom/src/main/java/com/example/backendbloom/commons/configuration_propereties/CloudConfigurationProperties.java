package com.example.backendbloom.commons.configuration_propereties;

import com.example.backendbloom.commons.configuration_propereties.cloud.AWS;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "cloud")
@Configuration
@Getter
@Setter
@Data
@RequiredArgsConstructor
public class CloudConfigurationProperties {
    private final AWS aws;
}
