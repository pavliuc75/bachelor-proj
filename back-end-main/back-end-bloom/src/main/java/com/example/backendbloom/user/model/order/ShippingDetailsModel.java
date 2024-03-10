package com.example.backendbloom.user.model.order;

import lombok.*;
import org.springframework.data.annotation.Id;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ShippingDetailsModel {
    @Id
    private String id;
    private String city;
    private String country;
    private String address;
    private String postalCode;

    public ShippingDetailsModel(String city, String country, String address, String postalCode) {
        this.city = city;
        this.country = country;
        this.address = address;
        this.postalCode = postalCode;
    }
}

