package com.example.backendbloom.business.service.review;

import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.review.BusinessReviewModel;
import com.example.backendbloom.business.repository.BusinessReviewRepository;
import com.example.backendbloom.commons.configuration.KeycloakAuthorizedUser;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusinessReviewServiceImpl implements BusinessReviewService {
    private final BusinessReviewRepository businessReviewRepository;

    @Override
    public BusinessReviewModel createOrUpdateBusinessApplicationReview(BusinessReviewModel businessApplicationReview) {
        //TODO: validation
        try {
            return businessReviewRepository.save(businessApplicationReview);
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public BusinessReviewModel getBusinessReviewModelById(String id) throws Exception {
        Optional<BusinessReviewModel> businessReviewModelWrapper = businessReviewRepository.findById(id);
        if (businessReviewModelWrapper.isPresent())
            return businessReviewModelWrapper.get();
        else throw new DefaultServerException("Business with given id is not found");
        //TODO: throw custom exception
    }
}
