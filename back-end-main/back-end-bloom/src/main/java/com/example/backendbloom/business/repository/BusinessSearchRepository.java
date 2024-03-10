package com.example.backendbloom.business.repository;

import com.example.backendbloom.business.model.business.BusinessModel;

import java.util.List;

public interface BusinessSearchRepository {
    public List<BusinessModel> searchBusiness(String text);
}
