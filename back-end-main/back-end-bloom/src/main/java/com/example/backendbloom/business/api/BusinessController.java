package com.example.backendbloom.business.api;

import com.backendbloom.openapi.api.BusinessApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.business.exception_handler.exception.BusinessChangeNotAuthorized;
import com.example.backendbloom.business.mapper.business.BusinessOpenApiMapper;
import com.example.backendbloom.business.model.BusinessDescriptionModel;
import com.example.backendbloom.business.model.business.BusinessModel;
import com.example.backendbloom.business.service.business.BusinessService;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import com.example.backendbloom.commons.util.Pagination;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class BusinessController implements BusinessApi {

    private final BusinessService businessService;
    private final BusinessOpenApiMapper businessOpenApiMapper;

    @Override
    public ResponseEntity<BusinessForPublicListResponse> searchBusiness(String text, Integer pageSize, Integer pageNumber) {
        try {
            List<BusinessModel> businessList =  businessService.searchBusiness(text);
            Page<BusinessModel> paginatedBusinessList = Pagination.paginateList(businessList, pageNumber, pageSize);
            BusinessForPublicListResponse businessForPublicListResponse = new BusinessForPublicListResponse();
            businessForPublicListResponse.setBusinessPageList(businessOpenApiMapper.businessListToPublicResponseList(paginatedBusinessList.toList()));
            businessForPublicListResponse.setTotalAmountOfElements(paginatedBusinessList.getTotalElements());
            businessForPublicListResponse.setTotalAmountOfPages(paginatedBusinessList.getTotalPages());
            return new ResponseEntity<>(businessForPublicListResponse, HttpStatus.OK);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<Business> getBusinessById(String businessApplicationId) {
        try {
            BusinessModel resultBusinessModel = businessService.getBusinessModelById(businessApplicationId);
            return new ResponseEntity<>(businessOpenApiMapper.businessModelToOpenApi(resultBusinessModel), HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<BusinessForPublicResponse> getBusinessForPublicById(String businessId) {
        try {
            BusinessModel resultBusinessModel = businessService.getBusinessModelById(businessId);
            return new ResponseEntity<>(businessOpenApiMapper.businessToPublicResponse(resultBusinessModel),HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<BusinessForPublicListResponse> getBusinessListForPublic(Integer pageSize, Integer pageNumber) {
        try {
            Page<BusinessModel> businessModelPage = businessService.getActiveBusinessModelPage(pageNumber,pageSize);
            BusinessForPublicListResponse businessForPublicListResponse = new BusinessForPublicListResponse();
            businessForPublicListResponse.setBusinessPageList(businessOpenApiMapper.businessListToPublicResponseList(businessModelPage.toList()));
            businessForPublicListResponse.setTotalAmountOfElements(businessModelPage.getTotalElements());
            businessForPublicListResponse.setTotalAmountOfPages(businessModelPage.getTotalPages());
            return new ResponseEntity<>(businessForPublicListResponse,HttpStatus.OK);
        } catch (ValueNotGreaterThanZero | ValueNotPositive | DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<BusinessForAdminListResponse> getBusinessListForAdmin(Integer pageSize, Integer pageNumber) {
        try {
            Page<BusinessModel> businessModelPage = businessService.getActiveBusinessModelPage(pageNumber,pageSize);
            BusinessForAdminListResponse businessForAdminListResponse = new BusinessForAdminListResponse();
            businessForAdminListResponse.setBusinessPageList(businessOpenApiMapper.businessListToOpenApi(businessModelPage.getContent()));
            businessForAdminListResponse.setTotalAmountOfElements(businessModelPage.getTotalElements());
            businessForAdminListResponse.setTotalAmountOfPages(businessModelPage.getTotalPages());
            return new ResponseEntity<>(businessForAdminListResponse,HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<Business> updateBusiness(UpdateBusinessRequest updateBusinessRequest) {
        try {
            BusinessModel resultBusinessModel = businessService.updateBusiness(businessOpenApiMapper.updateBusinessRequestToModel(updateBusinessRequest));
            return new ResponseEntity<>(businessOpenApiMapper.businessModelToOpenApi(resultBusinessModel),HttpStatus.OK);
        } catch (DefaultServerException | BusinessChangeNotAuthorized | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
