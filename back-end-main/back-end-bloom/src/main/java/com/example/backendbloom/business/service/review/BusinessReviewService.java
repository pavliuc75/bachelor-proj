package com.example.backendbloom.business.service.review;

import com.example.backendbloom.business.model.review.BusinessReviewModel;

public interface BusinessReviewService {
    BusinessReviewModel createOrUpdateBusinessApplicationReview(BusinessReviewModel businessApplicationReview) throws Exception;

    BusinessReviewModel getBusinessReviewModelById(String id) throws Exception;
}
