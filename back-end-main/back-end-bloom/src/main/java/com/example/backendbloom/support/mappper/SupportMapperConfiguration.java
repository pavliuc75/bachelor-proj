package com.example.backendbloom.support.mappper;

import com.example.backendbloom.support.mappper.mappers.SupportThreadOpenApiMapper;
import com.example.backendbloom.support.mappper.mappers.SupportThreadOpenApiMapperImpl;
import com.example.backendbloom.support.mappper.mappers.ThreadReplyOpenApiMapper;
import com.example.backendbloom.support.mappper.mappers.ThreadReplyOpenApiMapperImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SupportMapperConfiguration {
    @Bean
    public SupportThreadOpenApiMapper SupportThreadOpenApiMapper() {
        return new SupportThreadOpenApiMapperImpl();
    }
    @Bean
    public ThreadReplyOpenApiMapper threadReplyOpenApiMapper() {
        return new ThreadReplyOpenApiMapperImpl();
    }
}
