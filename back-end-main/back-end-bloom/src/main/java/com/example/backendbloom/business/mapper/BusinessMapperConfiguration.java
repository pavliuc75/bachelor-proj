package com.example.backendbloom.business.mapper;

import com.example.backendbloom.business.mapper.application.BusinessApplicationOpenApiMapper;
import com.example.backendbloom.business.mapper.application.BusinessApplicationOpenApiMapperImpl;
import com.example.backendbloom.business.mapper.business.BusinessOpenApiMapper;
import com.example.backendbloom.business.mapper.business.BusinessOpenApiMapperImpl;
import com.example.backendbloom.business.mapper.review.BusinessReviewOpenApiMapper;
import com.example.backendbloom.business.mapper.review.BusinessReviewOpenApiMapperImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BusinessMapperConfiguration {

    @Bean
    public BusinessApplicationOpenApiMapper businessApplicationOpenApiMapper() {
        return new BusinessApplicationOpenApiMapperImpl();
    }

    @Bean
    public BusinessReviewOpenApiMapper businessReviewOpenApiMapper() {
        return new BusinessReviewOpenApiMapperImpl();
    }

    @Bean
    public BusinessOpenApiMapper businessOpenApiMapper() {
        return new BusinessOpenApiMapperImpl();
    }
    @Bean
    public BusinessAnalyticsMapper businessAnalyticsMapper() {
        return new BusinessAnalyticsMapperImpl();
    }
}
