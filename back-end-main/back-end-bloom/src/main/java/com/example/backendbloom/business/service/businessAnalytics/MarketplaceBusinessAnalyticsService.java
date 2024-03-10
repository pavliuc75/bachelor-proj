package com.example.backendbloom.business.service.businessAnalytics;

import com.example.backendbloom.business.model.business.MarketplaceBusinessAnalyticsModel;
import com.stripe.exception.StripeException;

public interface MarketplaceBusinessAnalyticsService {
    MarketplaceBusinessAnalyticsModel getMarketplaceBusinessAnalytics();
    void generateReport() throws StripeException;
}
