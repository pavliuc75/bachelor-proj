package com.example.backendbloom.user.mapper;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserMapperConfiguration {

    @Bean
    public AppUserToOpenApiAppUserMapper appUserToOpenApiAppUserMapper() {
        return new AppUserToOpenApiAppUserMapperImpl();
    }
    @Bean
    public UserCartOpenApiMapper userCartOpenApiMapper() {
        return new UserCartOpenApiMapperImpl();
    }
    @Bean
    public OrderOpenApiMapper orderOpenApiMapper() {
        return new OrderOpenApiMapperImpl();
    }
    @Bean
    public WishlistOpenApiMapper wishlistOpenApiMapper() {
        return new WishlistOpenApiMapperImpl();
    }
}
