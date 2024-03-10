package com.example.backendbloom.business.mapper.review;

import com.backendbloom.openapi.model.BusinessApplicationReview;
import com.backendbloom.openapi.model.CreateBusinessReviewRequest;
import com.backendbloom.openapi.model.UpdateBusinessReviewRequest;
import com.example.backendbloom.business.model.review.BusinessReviewModel;
import org.mapstruct.Mapper;

@Mapper
public interface BusinessReviewOpenApiMapper {
    BusinessReviewModel fromOpenApiBusinessApplicationReview(BusinessApplicationReview businessApplicationReviewModel);

    BusinessApplicationReview businessApplicationReviewModelToOpenApi(BusinessReviewModel businessReviewModel);

    BusinessReviewModel fromCreateBusinessReviewRequestToModel(CreateBusinessReviewRequest createBusinessReviewRequest);

    BusinessReviewModel fromUpdateBusinessReviewRequestToModel(UpdateBusinessReviewRequest updateBusinessReviewRequest);
}
