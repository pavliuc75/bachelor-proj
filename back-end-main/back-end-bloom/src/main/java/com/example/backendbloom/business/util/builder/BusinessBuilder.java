package com.example.backendbloom.business.util.builder;

import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import lombok.experimental.UtilityClass;
import org.joda.time.DateTime;

@UtilityClass
public class BusinessBuilder {
    public static BusinessModel buildBusinessFromApplication(BusinessApplicationModel businessApplicationModel, BusinessState businessState, String businessId, String OwnerUserId) {
        BusinessModel businessModel = new BusinessModel();
        businessModel.setBusinessPaymentDetails(businessApplicationModel.getBusinessPaymentDetails());
        businessModel.setBusinessContacts(businessApplicationModel.getBusinessContacts());
        businessModel.setBusinessLogo(businessApplicationModel.getBusinessLogo());
        businessModel.setBusinessDescription(businessApplicationModel.getBusinessDescription());
        businessModel.setBusinessLegalDocuments(businessApplicationModel.getBusinessLegalDocuments());
        businessModel.setOwnerUserId(OwnerUserId);
        businessModel.setId(businessId);
        businessModel.setBusinessState(businessState);
        businessModel.setCreatedDate(DateTime.now());
        return businessModel;
    }

    public static BusinessModel buildUpdatedBusinessModel(BusinessModel oldModel, BusinessModel newModel) {
        BusinessModel businessModel = new BusinessModel();
        businessModel.setBusinessContacts(newModel.getBusinessContacts());
        businessModel.setBusinessDescription(newModel.getBusinessDescription());
        businessModel.setBusinessLogo(newModel.getBusinessLogo());
        businessModel.setBusinessLegalDocuments(newModel.getBusinessLegalDocuments());
        businessModel.setBusinessPaymentDetails(newModel.getBusinessPaymentDetails());
        businessModel.setOwnerUserId(oldModel.getOwnerUserId());
        businessModel.setId(oldModel.getId());
        businessModel.setBusinessState(oldModel.getBusinessState());
        return businessModel;
    }
}
