package com.example.backendbloom.business.service.businessAnalytics;

import com.example.backendbloom.business.model.business.MarketplaceBusinessAnalyticsModel;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import com.example.backendbloom.business.repository.MarketplaceBusinessAnalyticsRepository;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import com.example.backendbloom.user.model.order.OrderToFulfillModel;
import com.example.backendbloom.user.model.order.ProductInOrderModel;
import com.example.backendbloom.user.service.order.OrderService;
import com.example.backendbloom.user.service.user.AppUserService;
import com.stripe.exception.StripeException;
import com.stripe.model.reporting.ReportRun;
import com.stripe.model.reporting.ReportType;
import com.stripe.param.reporting.ReportRunCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketplaceBusinessAnalyticsServiceImpl implements MarketplaceBusinessAnalyticsService {
    private final MarketplaceBusinessAnalyticsRepository marketplaceBusinessAnalyticsRepository;
    private final BusinessService businessService;
    private final OrderService orderService;
    private final AppUserService appUserService;
    private final ProductService productService;

    @Override
    public void generateReport() throws StripeException {
        ReportType reportType = ReportType.retrieve("balance.summary.1");
        reportType.getId();
        ReportRunCreateParams params =
                ReportRunCreateParams.builder()
                        .setParameters(
                                ReportRunCreateParams.Parameters.builder()
                                        .setIntervalStart(reportType.getDataAvailableStart())
                                        .setIntervalEnd(reportType.getDataAvailableEnd())
                                        .setTimezone(ReportRunCreateParams.Parameters.Timezone.EUROPE_BUCHAREST)
                                        .addColumn("created")
                                        .addColumn("reporting_category")
                                        .addColumn("net")
                                        .build())
                        .setReportType("balance_change_from_activity.itemized.3")
                        .build();

        ReportRun report = ReportRun.create(params);
        ReportRun reportRun = null;
        int count = 0;
        do {
            if (count > 400) {
                break;
            }
            reportRun =
                    ReportRun.retrieve(
                            report.getId());
            count++;
        } while (!report.getStatus().equals("succeeded"));
        reportRun.getResult();
    }

    @Override
    public MarketplaceBusinessAnalyticsModel getMarketplaceBusinessAnalytics() {
        List<MarketplaceBusinessAnalyticsModel> marketplaceAnalyticsList = marketplaceBusinessAnalyticsRepository.findAll();
        if (marketplaceAnalyticsList.isEmpty()) {
            return createMarketplaceAnalytics();
        } else {
            MarketplaceBusinessAnalyticsModel marketplaceAnalytics = marketplaceAnalyticsList.get(0);
            computeMarketplaceAnalyticsData(marketplaceAnalyticsList.get(0));
            return marketplaceBusinessAnalyticsRepository.save(marketplaceAnalytics);
        }
    }

    private MarketplaceBusinessAnalyticsModel createMarketplaceAnalytics() {
        MarketplaceBusinessAnalyticsModel marketplaceBusinessAnalyticsModel = new MarketplaceBusinessAnalyticsModel();
        computeMarketplaceAnalyticsData(marketplaceBusinessAnalyticsModel);
        return marketplaceBusinessAnalyticsRepository.save(marketplaceBusinessAnalyticsModel);

    }

    private void computeMarketplaceAnalyticsData(MarketplaceBusinessAnalyticsModel marketplaceBusinessAnalyticsModel) {
        marketplaceBusinessAnalyticsModel.setTotalNumberOfBusinesses(computeTotalNumberBusinesses());
        Integer totalNumberOfOrders = computeTotalNumberOrders(Optional.empty());
        marketplaceBusinessAnalyticsModel.setTotalNumberOfOrders(totalNumberOfOrders);
        Integer totalNumberCompletedOrders = computeTotalNumberOrders(Optional.empty());
        marketplaceBusinessAnalyticsModel.setTotalNumberOfCompletedOrders(totalNumberCompletedOrders);
        Integer totalNumberOrdersToBeCompleted = totalNumberOfOrders - totalNumberCompletedOrders;
        marketplaceBusinessAnalyticsModel.setTotalNumberOfInProgressOrders(totalNumberOrdersToBeCompleted);
        marketplaceBusinessAnalyticsModel.setTotalRevenue(computeTotalRevenue());
        marketplaceBusinessAnalyticsModel.setTotalNumberOfProducts(computeTotalNumberOfProducts());
        marketplaceBusinessAnalyticsModel.setTotalNumberOfCustomers(computeTotalNumberOfCustomers());

    }

    private BigDecimal computeTotalRevenue() {
        List<OrderToFulfillModel> orderToFulfillList = orderService.getOrderToFulfillList(Optional.empty());
        BigDecimal totalRevenue = BigDecimal.ZERO;
        for (OrderToFulfillModel orderToFulfillModel : orderToFulfillList) {
            for (ProductInOrderModel product : orderToFulfillModel.getProductList()) {
                totalRevenue = totalRevenue.add(product.getPrice().multiply(BigDecimal.valueOf(product.getAmount())));
            }
        }
        return totalRevenue;
    }

    private Integer computeTotalNumberOfProducts() {
        return productService.getAllProducts().size();
    }

    private Integer computeTotalNumberOfCustomers() {
        return appUserService.getCustomersList().size();
    }

    private Integer computeTotalNumberOrders(Optional<OrderStatusModel> filterBy) {
        return orderService.getOrderToFulfillList(filterBy).size();
    }

    private Integer computeTotalNumberBusinesses() {
        return businessService.getBusinessList(Optional.of(BusinessState.ACTIVE)).size();
    }
}
