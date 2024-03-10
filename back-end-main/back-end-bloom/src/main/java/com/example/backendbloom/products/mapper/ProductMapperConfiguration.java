package com.example.backendbloom.products.mapper;

import com.example.backendbloom.products.mapper.mappers.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductMapperConfiguration {

    @Bean
    public ProductOpenApiMapper productOpenApiMapper() {
        return new ProductOpenApiMapperImpl();
    }
    @Bean
    public CategoryOpenApiMapper categoryOpenApiMapper() {
        return new CategoryOpenApiMapperImpl();
    }

    @Bean
    public CommentOpenApiMapper commentOpenApiMapper() {return new CommentOpenApiMapperImpl();}
}
