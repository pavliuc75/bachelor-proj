package com.example.backendbloom.business.service.business;

import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import org.springframework.data.domain.Page;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BusinessService {
    BusinessModel getBusinessModelById(String id);

    BusinessModel createOrUpdateBusinessModel(BusinessModel businessModel);

    Boolean isBusinessAlreadyCreatedById(String id);

    Page<BusinessModel> getActiveBusinessModelPage(int pageNumber, int pageSize);

    BusinessModel updateBusiness(BusinessModel businessModel) throws Exception;

    List<BusinessModel> searchBusiness(String text);

    List<BusinessModel> getBusinessList(Optional<BusinessState> state);
}
