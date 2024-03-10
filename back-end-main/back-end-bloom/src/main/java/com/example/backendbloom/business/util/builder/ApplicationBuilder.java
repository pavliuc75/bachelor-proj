package com.example.backendbloom.business.util.builder;

import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.application.enums.BusinessApplicationState;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ApplicationBuilder {
    public static BusinessApplicationModel buildNewBusinessApplicationModel(BusinessApplicationModel newModel, String createdBusinessId, String creatorUserId) {
        newModel.setCreatedBusinessId(createdBusinessId);
        newModel.setCreatorUserId(creatorUserId);
        newModel.setBusinessApplicationState(BusinessApplicationState.INREVIEW);
        return newModel;
    }
    public static BusinessApplicationModel buildUpdatedBusinessApplicationModel(BusinessApplicationModel oldModel, BusinessApplicationModel newModel, BusinessApplicationState businessApplicationState) {
        BusinessApplicationModel businessApplicationModel = new BusinessApplicationModel();
        businessApplicationModel.setBusinessContacts(newModel.getBusinessContacts());
        businessApplicationModel.setBusinessDescription(newModel.getBusinessDescription());
        businessApplicationModel.setBusinessLogo(newModel.getBusinessLogo());
        businessApplicationModel.setBusinessLegalDocuments(newModel.getBusinessLegalDocuments());
        businessApplicationModel.setBusinessPaymentDetails(newModel.getBusinessPaymentDetails());
        businessApplicationModel.setCreatedBusinessId(oldModel.getCreatedBusinessId());
        businessApplicationModel.setCreatorUserId(oldModel.getCreatorUserId());
        businessApplicationModel.setId(oldModel.getId());
        businessApplicationModel.setBusinessApplicationState(businessApplicationState);
        businessApplicationModel.setReviewId(oldModel.getReviewId());
        return businessApplicationModel;
    }
}
