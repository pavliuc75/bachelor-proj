package com.example.backendbloom.business.service.review;

import com.example.backendbloom.business.model.review.BusinessReviewModel;

public interface ReviewTransactionalService {
    BusinessReviewModel createNewReview(BusinessReviewModel businessReviewModel) throws Exception;


    BusinessReviewModel updateReview(BusinessReviewModel businessReviewModel) throws Exception;
}
