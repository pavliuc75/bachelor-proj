package com.example.backendbloom.business.service.application;

import com.example.backendbloom.business.model.application.BusinessApplicationModel;

public interface ApplicationTransactionalService {
    BusinessApplicationModel createBusinessApplication(BusinessApplicationModel businessApplication) throws Exception;

    BusinessApplicationModel updateBusinessApplication(BusinessApplicationModel businessApplication) throws Exception;
}
