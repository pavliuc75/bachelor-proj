package com.example.backendbloom.business.service.businessAnalytics;

import com.example.backendbloom.business.model.business.PublicBusinessAnalyticsModel;
import com.example.backendbloom.business.repository.PublicBusinessAnalyticsRepository;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.products.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
@Slf4j
public class PublicBusinessAnalyticsServiceImpl implements PublicBusinessAnalyticsService {
    private final PublicBusinessAnalyticsRepository businessAnalyticsRepository;
    private final ProductService productService;
    private final BusinessService businessService;

    @Override
    public PublicBusinessAnalyticsModel getPublicBusinessAnalytics(String businessId) {
        businessService.getBusinessModelById(businessId);
        PublicBusinessAnalyticsModel businessAnalyticsModel = businessAnalyticsRepository.findByBelongsToBusinessId(businessId);
        if (businessAnalyticsModel == null) {
            return createNewBusinessAnalytics(businessId);
        }
        computeBusinessAnalyticsData(businessAnalyticsModel);
        return businessAnalyticsRepository.save(businessAnalyticsModel);
    }

    private PublicBusinessAnalyticsModel createNewBusinessAnalytics(String businessId) {
        PublicBusinessAnalyticsModel businessAnalyticsModel = new PublicBusinessAnalyticsModel();
        businessAnalyticsModel.setBelongsToBusinessId(businessId);
        computeBusinessAnalyticsData(businessAnalyticsModel);
        return businessAnalyticsRepository.save(businessAnalyticsModel);
    }

    private void computeBusinessAnalyticsData(PublicBusinessAnalyticsModel businessAnalyticsModel) {
        AtomicReference<Integer> totalSoldProducts = new AtomicReference<>(0);
        List<BigDecimal> averageProductRatingList = new ArrayList<>();
        productService.getProductsByBusinessId(businessAnalyticsModel.getBelongsToBusinessId()).forEach(productModel -> {
            totalSoldProducts.updateAndGet(v -> v + productModel.getTotalSold());
            averageProductRatingList.add(productModel.getRating().getOverallRating());
        });
        businessAnalyticsModel.setSoldProductsTotal(totalSoldProducts.get());
        businessAnalyticsModel.setAverageProductRating(BigDecimal.valueOf(averageProductRatingList.stream().mapToDouble(BigDecimal::doubleValue).average().orElse(0)));
    }
}
