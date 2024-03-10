package com.example.backendbloom.business.service.application;

import com.example.backendbloom.business.exception_handler.exception.BusinessChangeNotAuthorized;
import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.application.enums.BusinessApplicationState;
import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.business.util.builder.ApplicationBuilder;
import com.example.backendbloom.business.util.builder.BusinessBuilder;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationTransactionalServiceImpl implements ApplicationTransactionalService {

    private final BusinessApplicationService businessApplicationService;

    private final BusinessService businessService;

    private final AppUserService appUserService;

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public BusinessApplicationModel createBusinessApplication(BusinessApplicationModel businessApplication) throws Exception {
        //TODO: validation
        String userId = appUserService.getIdOfKeycloakUser();
        BusinessModel businessModel = BusinessBuilder.buildBusinessFromApplication(businessApplication, BusinessState.BLOCKED, null, userId);
        BusinessModel resultBusinessModel = businessService.createOrUpdateBusinessModel(businessModel);
        BusinessApplicationModel newBusinessApplication = ApplicationBuilder.buildNewBusinessApplicationModel(businessApplication, resultBusinessModel.getId(), userId);
        BusinessApplicationModel resultBusinessApplicationModel = businessApplicationService.createOrUpdateBusinessApplication(newBusinessApplication);
        appUserService.setUserBusinessInformation(userId, resultBusinessApplicationModel.getId(), resultBusinessModel.getId());
        return resultBusinessApplicationModel;
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public BusinessApplicationModel updateBusinessApplication(BusinessApplicationModel newBusinessApplication) throws Exception {
        //TODO: validation
        BusinessApplicationModel oldBusinessApplication = businessApplicationService.getBusinessApplicationById(newBusinessApplication.getId());
        if (!appUserService.verifyKeycloakUserById(oldBusinessApplication.getCreatorUserId())) {
            throw new BusinessChangeNotAuthorized(appUserService.getIdOfKeycloakUser(),oldBusinessApplication.getCreatedBusinessId());
        }
        BusinessApplicationModel updatedBusinessApplicationModel = ApplicationBuilder.buildUpdatedBusinessApplicationModel(oldBusinessApplication, newBusinessApplication, BusinessApplicationState.INREVIEW);
        return businessApplicationService.createOrUpdateBusinessApplication(updatedBusinessApplicationModel);
    }
}
