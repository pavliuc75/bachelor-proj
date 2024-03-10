package com.example.backendbloom.business.mapper.business;

import com.backendbloom.openapi.model.Business;
import com.backendbloom.openapi.model.BusinessForPublicResponse;
import com.backendbloom.openapi.model.UpdateBusinessRequest;
import com.example.backendbloom.business.model.business.BusinessModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface BusinessOpenApiMapper {
    BusinessModel fromBusinessModel(Business business);
    Business businessModelToOpenApi(BusinessModel businessModel);
    BusinessForPublicResponse businessToPublicResponse(BusinessModel business);

    BusinessModel updateBusinessRequestToModel(UpdateBusinessRequest updateBusinessRequest);

    List<BusinessForPublicResponse> businessListToPublicResponseList(List<BusinessModel> businessesList);

    List<Business> businessListToOpenApi(List<BusinessModel> businessModel);
}
