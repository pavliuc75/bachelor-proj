package com.example.backendbloom.business.api;

import com.backendbloom.openapi.api.BusinessReviewApi;
import com.backendbloom.openapi.model.BusinessApplicationReview;
import com.backendbloom.openapi.model.CreateBusinessReviewRequest;
import com.backendbloom.openapi.model.UpdateBusinessReviewRequest;
import com.example.backendbloom.business.mapper.review.BusinessReviewOpenApiMapper;
import com.example.backendbloom.business.model.review.BusinessReviewModel;
import com.example.backendbloom.business.service.review.BusinessReviewService;
import com.example.backendbloom.business.service.review.ReviewTransactionalService;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@Slf4j
@RestController
@RequiredArgsConstructor
public class BusinessReviewController implements BusinessReviewApi {
    private final ReviewTransactionalService reviewTransactionalService;
    private final BusinessReviewOpenApiMapper businessReviewOpenApiMapper;

    private final BusinessReviewService businessReviewService;

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<BusinessApplicationReview> createBusinessApplicationReview(CreateBusinessReviewRequest createBusinessReviewRequest) {
        try {
            BusinessReviewModel businessReviewModel = businessReviewOpenApiMapper.fromCreateBusinessReviewRequestToModel(createBusinessReviewRequest);
            BusinessReviewModel resultBusinessReviewModel = reviewTransactionalService.createNewReview(businessReviewModel);
            return new ResponseEntity<>(businessReviewOpenApiMapper.businessApplicationReviewModelToOpenApi(resultBusinessReviewModel),
                    HttpStatus.CREATED);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<BusinessApplicationReview> updateBusinessApplicationReview(UpdateBusinessReviewRequest updateBusinessReviewRequest) {
        try {
            BusinessReviewModel businessReviewModel = businessReviewOpenApiMapper.fromUpdateBusinessReviewRequestToModel(updateBusinessReviewRequest);
            BusinessReviewModel resultBusinessReviewModel = reviewTransactionalService.updateReview(businessReviewModel);
            return new ResponseEntity<>(businessReviewOpenApiMapper.businessApplicationReviewModelToOpenApi(resultBusinessReviewModel),
                    HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN,AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<BusinessApplicationReview> getReviewById(String businessReviewId) {
        try{
            BusinessReviewModel businessReviewModel = businessReviewService.getBusinessReviewModelById(businessReviewId);
            return new ResponseEntity<>(businessReviewOpenApiMapper.businessApplicationReviewModelToOpenApi(businessReviewModel), HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
