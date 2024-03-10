package com.example.backendbloom.business.service.businessAnalytics;

import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.business.PrivateBusinessAnalyticsModel;
import com.example.backendbloom.business.repository.PrivateBusinessAnalyticsRepository;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import com.example.backendbloom.user.model.order.OrderToFulfillModel;
import com.example.backendbloom.user.service.order.OrderService;
import com.example.backendbloom.user.service.user.AppUserService;
import com.example.backendbloom.user.service.user.UserBusinessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrivateBusinessAnalyticsServiceImpl implements PrivateBusinessAnalyticsService {
    private final BusinessService businessService;
    private final AppUserService appUserService;
    private final UserBusinessService userBusinessService;
    private final PrivateBusinessAnalyticsRepository privateBusinessAnalyticsRepository;
    private final OrderService orderService;

    @Override
    public PrivateBusinessAnalyticsModel getPrivateBusinessAnalytics() {
        String businessId = userBusinessService.getUserBusinessId();
        BusinessModel businessModel = businessService.getBusinessModelById(businessId);
        PrivateBusinessAnalyticsModel privateBusinessAnalyticsModel = privateBusinessAnalyticsRepository.findByBelongsToBusinessId(businessId);
        if (privateBusinessAnalyticsModel == null) {
            privateBusinessAnalyticsModel = createPrivateBusinessAnalytics(businessModel);
        } else {
            computePrivateBusinessAnalytics(privateBusinessAnalyticsModel);
        }
        return privateBusinessAnalyticsRepository.save(privateBusinessAnalyticsModel);
    }

    private void computePrivateBusinessAnalytics(PrivateBusinessAnalyticsModel privateBusinessAnalyticsModel) {
//        String businessId = privateBusinessAnalyticsModel.getBelongsToBusinessId();
        List<OrderToFulfillModel> orders = orderService.getOrderToFulfillList(Optional.empty());
        privateBusinessAnalyticsModel.setTotalNumberOfCompletedOrders(computeTotalNumberOfCompletedOrders(orders));
        privateBusinessAnalyticsModel.setTotalIncome(computeTotalIncome(orders));
        privateBusinessAnalyticsModel.setTotalSoldAmountProducts(computeTotalSoldProduct(orders));
        privateBusinessAnalyticsModel.setTotalNumberOfOrdersToBeCompleted(computeTotalNumberOfOrdersToBeCompleted(orders));
    }

    private Integer computeTotalNumberOfOrdersToBeCompleted(List<OrderToFulfillModel> orders) {
        Integer count = 0;
        for (OrderToFulfillModel order : orders) {
            if (!order.getOrderStatus().equals(OrderStatusModel.COMPLETED)) {
                count++;
            }
        }
        return count;
    }

    private Integer computeTotalSoldProduct(List<OrderToFulfillModel> orders) {
        return orders.stream()
                .map(OrderToFulfillModel::getProductList)
                .mapToInt(List::size)
                .sum();
    }

    private BigDecimal computeTotalIncome(List<OrderToFulfillModel> orders) {
        BigDecimal totalIncome = BigDecimal.ZERO;
        for (OrderToFulfillModel order : orders) {
            totalIncome = totalIncome.add(order.getProductList().stream().map(product -> product.getPrice().multiply(BigDecimal.valueOf(product.getAmount()))).reduce(BigDecimal.ZERO, BigDecimal::add));
        }
        return totalIncome;
    }

    private Integer computeTotalNumberOfCompletedOrders(List<OrderToFulfillModel> orders) {
        return orderService.filterOrderToFulfillModel(orders, Optional.of(OrderStatusModel.COMPLETED)).size();
    }

    private PrivateBusinessAnalyticsModel createPrivateBusinessAnalytics(BusinessModel businessModel) {
        PrivateBusinessAnalyticsModel privateBusinessAnalyticsModel = new PrivateBusinessAnalyticsModel();
        privateBusinessAnalyticsModel.setBelongsToBusinessId(businessModel.getId());
        computePrivateBusinessAnalytics(privateBusinessAnalyticsModel);
        return privateBusinessAnalyticsRepository.save(privateBusinessAnalyticsModel);
    }
}
