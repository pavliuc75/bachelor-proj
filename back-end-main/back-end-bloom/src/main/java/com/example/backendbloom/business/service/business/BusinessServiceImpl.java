package com.example.backendbloom.business.service.business;

import com.example.backendbloom.business.exception_handler.exception.BusinessChangeNotAuthorized;
import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.model.business.enums.BusinessState;
import com.example.backendbloom.business.repository.BusinessRepository;
import com.example.backendbloom.business.repository.BusinessSearchRepository;
import com.example.backendbloom.business.util.builder.BusinessBuilder;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import com.example.backendbloom.commons.util.ValidationUtil;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusinessServiceImpl implements BusinessService {
    private final BusinessRepository businessRepository;
    private final BusinessSearchRepository businessSearchRepository;
    private final AppUserService appUserService;
    @Override
    public BusinessModel getBusinessModelById(String id) {
        Optional<BusinessModel> businessModelWrapper = businessRepository.findById(id);
        if (businessModelWrapper.isPresent())
            return businessModelWrapper.get();
        else throw new ObjectNotFound("Business", id);
    }

    @Override
    public Boolean isBusinessAlreadyCreatedById(String id) {
        return businessRepository.existsById(id);
    }

    @Override
    public BusinessModel createOrUpdateBusinessModel(BusinessModel businessModel) {
        return businessRepository.save(businessModel);
    }

    @Override
    public List<BusinessModel> searchBusiness(String text) {
        return businessSearchRepository.searchBusiness(text);
    }

    @Override
    public List<BusinessModel> getBusinessList(Optional<BusinessState> state) {
        if (state.isPresent())
            return businessRepository.findBy(state.get());
        else return businessRepository.findAll();
    }

    @Override
    public Page<BusinessModel> getActiveBusinessModelPage(int pageNumber, int pageSize) throws ValueNotGreaterThanZero, ValueNotPositive {
        ValidationUtil.validatePagination(pageSize, pageNumber);
        return businessRepository.findBy(BusinessState.ACTIVE, PageRequest.of(pageNumber, pageSize,Sort.by(Sort.Direction.DESC,"businessDescription.legalName")));
    }

    @Override
    public BusinessModel updateBusiness(BusinessModel businessModel) throws Exception {
        BusinessModel oldBusinessModel = getBusinessModelById(businessModel.getId());
        if (!appUserService.verifyKeycloakUserById(oldBusinessModel.getOwnerUserId())) {
            throw new BusinessChangeNotAuthorized(appUserService.getIdOfKeycloakUser(), oldBusinessModel.getId());
        }
        return businessRepository.save(BusinessBuilder.buildUpdatedBusinessModel(oldBusinessModel, businessModel));
    }
}
