package com.example.backendbloom.user.service.order;

import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.commons.configuration.KeycloakAuthorizedUser;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.user.exception_handler.exception.OrderStatusCannotBeSet;
import com.example.backendbloom.user.exception_handler.exception.UserNotHaveBusiness;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.cart.ProductInCartModel;
import com.example.backendbloom.user.model.order.*;
import com.example.backendbloom.user.repository.order.OrderToFulfillRepository;
import com.example.backendbloom.user.repository.order.OrderModelRepository;
import com.example.backendbloom.user.service.cart.UserCartService;
import com.example.backendbloom.user.service.user.AppUserService;
import com.example.backendbloom.user.service.user.UserBusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    private final AppUserService appUserService;
    private final OrderModelRepository orderModelRepository;
    private final ProductService productService;
    private final BusinessService businessService;
    private final OrderToFulfillRepository businessOwnerOrderToFulfillRepository;
    private final UserBusinessService userBusinessService;
    private final UserCartService userCartService;

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void fulfillOrder(String customerEmail, List<ProductInOrderModel> productList, ShippingDetailsModel shippingDetails) {
        AppUserModel appUser = appUserService.getAppUserByEmail(customerEmail);
//        AppUserModel appUser = appUserService.getCurrentUser();
//        assign orders to business owners
        List<OrderToFulfillModel> orderToFulfills = assignOrderToBusinessOwners(appUser, productList, shippingDetails);
//        Add order for user
        OrderModel customerOrderModel = new OrderModel(orderToFulfills, appUser.getId(), OrderStatusModel.AWAITING_SHIPMENT, shippingDetails);
        OrderModel savedOrderModel = orderModelRepository.save(customerOrderModel);
//        decrease products stock amount
        decreaseProductsStockAmount(productList);
        increaseProductsSoldAmount(productList);
        userCartService.recycleUserCart(Optional.ofNullable(appUser.getId()));
    }

    private void increaseProductsSoldAmount(List<ProductInOrderModel> productList) {
        for (   ProductInOrderModel productInOrderModel : productList) {
            ProductModel productModel = productService.getProductById(productInOrderModel.getId());
            productModel.setTotalSold(productModel.getTotalSold() + productInOrderModel.getAmount());
            productService.updateProduct(productModel);
        }
    }


    @Override
    public List<OrderModel> getCurrentUserOrderList(OrderStatusModel filterBy) {
        AppUserModel appUser = appUserService.getCurrentUser();
        List<OrderModel> orderModelList = orderModelRepository.findByPlacedBy(appUser.getId());
        if (filterBy != null) {
            Predicate<OrderModel> filterByStatus = e -> e.getOrderStatus().equals(filterBy);
            return orderModelList.stream()
                    .filter(filterByStatus).collect(Collectors.toList());
        }
        return orderModelList;
    }

    @Override
    public List<OrderToFulfillModel> getOrderToFulfillList(Optional<OrderStatusModel> filterBy) throws UserNotHaveBusiness {
        List<OrderToFulfillModel> orderToFulfillModels = getOrderToFulfillModelList();
        return filterOrderToFulfillModel(orderToFulfillModels,filterBy);
    }

    public List<OrderToFulfillModel> filterOrderToFulfillModel(List<OrderToFulfillModel> orderToFulfillModels, Optional<OrderStatusModel> filterBy) {
        if (filterBy.isPresent()) {
            Predicate<OrderToFulfillModel> filterByStatus = e -> e.getOrderStatus().equals(filterBy.get());
            return orderToFulfillModels.stream()
                    .filter(filterByStatus).collect(Collectors.toList());
        }
        return orderToFulfillModels;
    }

    private void decreaseProductsStockAmount(List<ProductInOrderModel> productList) {
        for (ProductInOrderModel product : productList) {
            productService.decreaseProductStockAmount(product.getId(), product.getAmount());
        }
    }


    @Override
    public OrderToFulfillModel updateOrderToFulfillProductOrderStatus(String orderId, String productId, OrderStatusModel newStatus) throws OrderStatusCannotBeSet {
        OrderToFulfillModel order = getOrderToFulfillModel(orderId, newStatus);
        for (ProductInOrderModel product : order.getProductList()) {
            if (productId.equals(product.getId())) {
                product.setOrderStatus(newStatus);
                businessOwnerOrderToFulfillRepository.save(order);
            }
        }
        updateProductToFulfillOrderStatus(order);
        return order;
    }

    private OrderToFulfillModel getOrderToFulfillById(String orderId) {
        Optional<OrderToFulfillModel> order = businessOwnerOrderToFulfillRepository.findById(orderId);
        if (!order.isPresent()) {
            throw new ObjectNotFound("Order", orderId);
        }
        return order.get();
    }

    /**
     * Validated that business owner sets the order status only to READY_FOR_SHIPMENT or AWAITING_SHIPMENT
     */
    private void validateOrdersStatusCanBeSet(OrderStatusModel newStatus, boolean isUserAdmin) throws OrderStatusCannotBeSet {
        if (!(newStatus.equals(OrderStatusModel.READY_FOR_SHIPMENT) || newStatus.equals(OrderStatusModel.AWAITING_SHIPMENT)) && !isUserAdmin) {
            throw new OrderStatusCannotBeSet(newStatus);
        }
    }

    public OrderToFulfillModel getOrderToFulfillByIdAndFulfilledBy(String orderId, String fulfilledBy) {
        OrderToFulfillModel order = businessOwnerOrderToFulfillRepository.findByIdAndFulfilledBy(orderId, fulfilledBy);
        if (order == null) {
            throw new ObjectNotFound("Order", orderId);
        }
        return order;
    }

    @Override
    public OrderToFulfillModel updateOrderToFulfillOrderStatus(String orderId, OrderStatusModel orderStatus) {
        OrderToFulfillModel order = getOrderToFulfillModel(orderId, orderStatus);
        for (ProductInOrderModel product : order.getProductList()) {
            product.setOrderStatus(orderStatus);
        }
        order.setOrderStatus(orderStatus);
        businessOwnerOrderToFulfillRepository.save(order);
        return order;
    }

    private OrderToFulfillModel getOrderToFulfillModel(String orderId, OrderStatusModel orderStatus) {
        boolean isUserAdmin = appUserService.isUserAdmin();
        validateOrdersStatusCanBeSet(orderStatus, isUserAdmin);
        OrderToFulfillModel order;
        if (isUserAdmin) {
            order = getOrderToFulfillById(orderId);
        } else {
            String userBusinessId = userBusinessService.getUserBusinessId();
            order = getOrderToFulfillByIdAndFulfilledBy(orderId, userBusinessId);
        }
        return order;
    }
    private List<OrderToFulfillModel> getOrderToFulfillModelList() {
        boolean isUserAdmin = appUserService.isUserAdmin();
        List<OrderToFulfillModel> orderList;
        if (isUserAdmin) {
            orderList = businessOwnerOrderToFulfillRepository.findAll();
        } else {
            String userBusinessId = userBusinessService.getUserBusinessId();
            orderList = businessOwnerOrderToFulfillRepository.findByFulfilledBy(userBusinessId);
        }
        return orderList;
    }
    /**
     * Updates ProductToFulfill order status only if all products have the same status
     *
     * @param order
     */
    private void updateProductToFulfillOrderStatus(OrderToFulfillModel order) {
        List<ProductInOrderModel> filteredProductsByOrderStatus;
        OrderStatusModel status = order.getProductList().get(0).getOrderStatus();
        Predicate<ProductInOrderModel> filterByStatus = e -> e.getOrderStatus().equals(status);
        filteredProductsByOrderStatus = order.getProductList().stream()
                .filter(filterByStatus).collect(Collectors.toList());
        if (filteredProductsByOrderStatus.size() == order.getProductList().size()) {
            order.setOrderStatus(status);
            businessOwnerOrderToFulfillRepository.save(order);
        }
    }

    private List<OrderToFulfillModel> assignOrderToBusinessOwners(AppUserModel placedBy, List<ProductInOrderModel> productInOrderList, ShippingDetailsModel shippingDetails) {
        List<OrderToFulfillModel> ordersToFulfill = new ArrayList<>();
//        List<ProductInOrderModel> productInOrderList = mapProductInCartModelToProductInOrderList(productList);
        Map<String, List<ProductInOrderModel>> businessProductListToFulfill = new HashMap<>();
//        map each product to a business owner
        for (ProductInOrderModel product : productInOrderList) {
            ProductModel productModel = productService.getProductById(product.getId());
            businessProductListToFulfill.computeIfAbsent(productModel.getBelongsToBusinessId(), k -> new ArrayList<>());
            businessProductListToFulfill.get(productModel.getBelongsToBusinessId()).add(product);
        }
        //        assign orders to business owners
        for (Map.Entry<String, List<ProductInOrderModel>> businessOwnerEntry : businessProductListToFulfill.entrySet()) {
            ordersToFulfill.add(assignOrderToBusinessOwner(businessOwnerEntry.getKey(), businessOwnerEntry.getValue(), placedBy, shippingDetails));
        }
        return ordersToFulfill;
    }

    private OrderToFulfillModel assignOrderToBusinessOwner(String belongsToBusinessId, List<ProductInOrderModel> productList, AppUserModel orderedBy, ShippingDetailsModel shippedTo) {
        BusinessModel fulfilledBy = businessService.getBusinessModelById(belongsToBusinessId);
        OrderToFulfillModel orderToFulfill = new OrderToFulfillModel(productList, fulfilledBy.getId(), orderedBy.getId(), shippedTo, OrderStatusModel.AWAITING_SHIPMENT);
        return businessOwnerOrderToFulfillRepository.save(orderToFulfill);
    }

//    private List<ProductInOrderModel> mapProductInCartModelToProductInOrderList(List<ProductInCartModel> productList) {
//        List<ProductInOrderModel> productInOrderList = new ArrayList<>();
//        for (ProductInCartModel product : productList) {
//            ProductInOrderModel product1 = new ProductInOrderModel();
//            product1.setProduct(product);
//            product1.setOrderStatus(OrderStatusModel.AWAITING_SHIPMENT);
//            productInOrderList.add(product1);
//        }
//        return productInOrderList;
//    }
}
