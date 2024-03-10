package com.example.backendbloom.products.service.product;

import com.example.backendbloom.products.exception_handler.exception.ProductAlreadyRated;
import com.example.backendbloom.products.exception_handler.exception.ProductNotMeetsRatingCriteria;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.model.product.ProductRatingModel;
import com.example.backendbloom.products.model.product.UserProductRatingModel;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.model.order.OrderModel;
import com.example.backendbloom.user.model.order.OrderStatusModel;
import com.example.backendbloom.user.model.order.OrderToFulfillModel;
import com.example.backendbloom.user.model.order.ProductInOrderModel;
import com.example.backendbloom.user.service.order.OrderService;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateProductServiceImpl implements RateProductService {
    private final ProductService productService;
    private final OrderService orderService;
    private final AppUserService appUserService;

    @Override
    public ProductModel rateProduct(String productId, BigDecimal newRating) throws ProductNotMeetsRatingCriteria {
        ProductModel productModel = productService.getProductById(productId);
        if (productModel.getRating() == null) {
            productModel.setRating(new ProductRatingModel());
        }
        updateProductRating(productModel.getRating(), newRating);
        updateUserProductRating(productModel, newRating);
        return         productService.updateProduct(productModel);

    }

    private AppUserModel updateUserProductRating(ProductModel productModel, BigDecimal newRating) {
        AppUserModel appUserModel = appUserService.getCurrentUser();
        List<UserProductRatingModel> userProductRating = appUserModel.getRatedProductList();
        if (appUserModel.getRatedProductList() == null) {
            appUserModel.setRatedProductList(new ArrayList<UserProductRatingModel>());
        } else {
            validateUserDidNotRateProductBefore(productModel, userProductRating);
        }
        UserProductRatingModel userProductRating1 = new UserProductRatingModel();
        userProductRating1.setRatedBy(appUserModel.getId());
        userProductRating1.setRating(newRating);
        userProductRating1.setRatedProductId(productModel.getId());
        appUserModel.getRatedProductList().add(userProductRating1);
        return appUserService.updateUser(appUserModel);
    }

    private void validateUserDidNotRateProductBefore(ProductModel productModel, List<UserProductRatingModel> userProductRating) {
        userProductRating.removeIf(userProductRating1 -> userProductRating1.getRatedProductId().equals(productModel.getId()));
    }

    /**
     * Updates product rating by calculating rating of product based on new rating and previous rating in accordance with the formula:
     * AR = 1*a+2*b+3*c+4*d+5*e/(R)
     * Where AR is the average rating:
     * a is the number of 1-star ratings
     * b is the number of 2-star ratings
     * c is the number of 3-star ratings
     * d is the number of 4-star ratings
     * e is the number of 5-star ratings
     * R is the total number of ratings
     *
     * @param ratingModel - product to be rated
     * @param rating      - new rating
     */
    private void updateProductRating(ProductRatingModel ratingModel, BigDecimal rating) {
        BigDecimal roundedRating = rating.setScale(0, RoundingMode.CEILING);
        switch (roundedRating.intValue()) {
            case 1:
                ratingModel.setOneStar(ratingModel.getOneStar() + 1);
                break;
            case 2:
                ratingModel.setTwoStar(ratingModel.getTwoStar() + 1);
                break;
            case 3:
                ratingModel.setThreeStar(ratingModel.getThreeStar() + 1);
                break;
            case 4:
                ratingModel.setFourStar(ratingModel.getFourStar() + 1);
                break;
            case 5:
                ratingModel.setFiveStar(ratingModel.getFiveStar() + 1);
                break;
        }
        ratingModel.setTotalRatings(ratingModel.getTotalRatings() + 1);
        BigDecimal newOverallRating = BigDecimal.valueOf(((long) ratingModel.getOneStar() +
                ratingModel.getTwoStar() * 2 +
                ratingModel.getThreeStar() * 3L +
                ratingModel.getFourStar() * 4 +
                ratingModel.getFiveStar() * 5L) /
                ratingModel.getTotalRatings());
        ratingModel.setOverallRating(newOverallRating);
    }
}
