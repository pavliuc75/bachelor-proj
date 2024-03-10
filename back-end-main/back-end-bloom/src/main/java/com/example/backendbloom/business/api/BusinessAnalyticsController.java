package com.example.backendbloom.business.api;

import com.backendbloom.openapi.api.BusinessAnalyticsApi;
import com.backendbloom.openapi.model.MarketplaceBusinessAnalytics;
import com.backendbloom.openapi.model.PrivateBusinessAnalytics;
import com.backendbloom.openapi.model.PublicBusinessAnalytics;
import com.example.backendbloom.business.mapper.BusinessAnalyticsMapper;
import com.example.backendbloom.business.model.business.MarketplaceBusinessAnalyticsModel;
import com.example.backendbloom.business.model.business.PrivateBusinessAnalyticsModel;
import com.example.backendbloom.business.model.business.PublicBusinessAnalyticsModel;
import com.example.backendbloom.business.service.businessAnalytics.MarketplaceBusinessAnalyticsService;
import com.example.backendbloom.business.service.businessAnalytics.PrivateBusinessAnalyticsService;
import com.example.backendbloom.business.service.businessAnalytics.PublicBusinessAnalyticsService;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@Slf4j
@RestController
@RequiredArgsConstructor
public class BusinessAnalyticsController implements BusinessAnalyticsApi {
    private final PublicBusinessAnalyticsService publicBusinessAnalyticsService;
    private final BusinessAnalyticsMapper businessAnalyticsMapper;
    private final PrivateBusinessAnalyticsService privateBusinessAnalyticsService;
    private final MarketplaceBusinessAnalyticsService marketplaceBusinessAnalyticsService;

    @Override
    public ResponseEntity<PublicBusinessAnalytics> getPublicBusinessAnalytics(String businessId) {
        try {
            PublicBusinessAnalyticsModel businessAnalytics = publicBusinessAnalyticsService.getPublicBusinessAnalytics(businessId);
            return ResponseEntity.ok(businessAnalyticsMapper.publicBusinessAnalyticsModelToPublicBusinessAnalytics(businessAnalytics));
        } catch (ObjectNotFound | DefaultServerException e) {
            log.error("Error getting public business analytics", e);
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<MarketplaceBusinessAnalytics> getMarketplaceAnalytics() {
        try {
            MarketplaceBusinessAnalyticsModel businessAnalytics = marketplaceBusinessAnalyticsService.getMarketplaceBusinessAnalytics();
            return ResponseEntity.ok(businessAnalyticsMapper.marketplaceBusinessAnalyticsModelToMarketplaceBusinessAnalytics(businessAnalytics));
        } catch (ObjectNotFound | DefaultServerException e) {
            log.error("Error getting private business analytics", e);
            throw e;
        } catch (Exception e) {
            log.error("Error getting private business analytics", e);
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER})

    public ResponseEntity<PrivateBusinessAnalytics> getPrivateBusinessAnalytics() {
        try {
            PrivateBusinessAnalyticsModel businessAnalytics = privateBusinessAnalyticsService.getPrivateBusinessAnalytics();
            return ResponseEntity.ok(businessAnalyticsMapper.privateBusinessAnalyticsModelToPrivateBusinessAnalytics(businessAnalytics));
        } catch (ObjectNotFound | DefaultServerException e) {
            log.error("Error getting private business analytics", e);
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}

