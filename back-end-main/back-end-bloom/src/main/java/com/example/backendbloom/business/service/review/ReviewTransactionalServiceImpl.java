package com.example.backendbloom.business.service.review;

import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.application.enums.BusinessApplicationState;
import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import com.example.backendbloom.business.model.review.BusinessReviewModel;
import com.example.backendbloom.business.service.application.BusinessApplicationService;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.business.util.builder.BusinessBuilder;
import com.example.backendbloom.business.util.builder.ReviewBuilder;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewTransactionalServiceImpl implements ReviewTransactionalService {

    private final BusinessReviewService businessReviewService;
    private final BusinessApplicationService businessApplicationService;
    private final AppUserService appUserService;
    private final BusinessService businessService;


    @Override
    @Transactional(rollbackFor = Throwable.class)
    public BusinessReviewModel createNewReview(BusinessReviewModel businessReviewModel) throws Exception {
            //TODO: validation
            BusinessApplicationModel businessApplication = businessApplicationService.getBusinessApplicationById(businessReviewModel.getBusinessApplicationId());
            BusinessModel business = businessService.getBusinessModelById(businessApplication.getCreatedBusinessId());
            businessReviewModel.setReviewAuthorId(appUserService.getIdOfKeycloakUser());
            BusinessReviewModel createdReview = businessReviewService.createOrUpdateBusinessApplicationReview(businessReviewModel);
            businessApplication.setReviewId(createdReview.getId());
            handleReview(businessReviewModel, businessApplication, business);
            return createdReview;
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public BusinessReviewModel updateReview(BusinessReviewModel businessReviewModel) throws Exception {
            //TODO: validation
            BusinessReviewModel oldBusinessReview = businessReviewService.getBusinessReviewModelById(businessReviewModel.getId());
            BusinessApplicationModel businessApplication = businessApplicationService.getBusinessApplicationById(oldBusinessReview.getBusinessApplicationId());
            BusinessModel business = businessService.getBusinessModelById(businessApplication.getCreatedBusinessId());
            businessReviewModel.setReviewAuthorId(appUserService.getIdOfKeycloakUser());
            BusinessReviewModel updatedReview = ReviewBuilder.BuildUpdatedReview(oldBusinessReview,businessReviewModel);
            handleReview(updatedReview,businessApplication,business);
            return businessReviewService.createOrUpdateBusinessApplicationReview(updatedReview);
    }

    private String handleReview(BusinessReviewModel businessReviewModel, BusinessApplicationModel businessApplication, BusinessModel business) throws Exception {
        switch (businessReviewModel.getBusinessReviewState()) {
            case APPROVED:
                businessApplication.setBusinessApplicationState(BusinessApplicationState.APPROVED);
                business = BusinessBuilder.buildBusinessFromApplication(businessApplication, BusinessState.ACTIVE, business.getId(), businessApplication.getCreatorUserId());
                businessService.createOrUpdateBusinessModel(business);
                businessApplicationService.createOrUpdateBusinessApplication(businessApplication);
                break;
            case DENIED:
                business.setBusinessState(BusinessState.BLOCKED);
                businessApplication.setBusinessApplicationState(BusinessApplicationState.DENIED);
                businessService.createOrUpdateBusinessModel(business);
                businessApplicationService.createOrUpdateBusinessApplication(businessApplication);
                break;
            default:
                throw new DefaultServerException("the review state is not provided");
                //TODO: throw custom exception
        }
        return businessApplication.getId();
    }
}
