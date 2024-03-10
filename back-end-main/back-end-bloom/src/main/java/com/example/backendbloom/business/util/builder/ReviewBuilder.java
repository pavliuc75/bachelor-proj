package com.example.backendbloom.business.util.builder;

import com.example.backendbloom.business.model.review.BusinessReviewModel;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ReviewBuilder {
    public static BusinessReviewModel BuildUpdatedReview(BusinessReviewModel oldReview, BusinessReviewModel updatedReview)
    {
        oldReview.setReviewAuthorId(updatedReview.getReviewAuthorId());
        oldReview.setBusinessReviewDescription(updatedReview.getBusinessReviewDescription());
        oldReview.setBusinessReviewState(updatedReview.getBusinessReviewState());
        return oldReview;
    }
}
