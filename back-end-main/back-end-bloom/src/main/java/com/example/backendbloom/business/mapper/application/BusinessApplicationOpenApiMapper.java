package com.example.backendbloom.business.mapper.application;

import com.backendbloom.openapi.model.BusinessApplication;
import com.backendbloom.openapi.model.CreateBusinessApplicationRequest;
import com.backendbloom.openapi.model.UpdateBusinessApplicationRequest;
import com.example.backendbloom.business.model.*;
import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import org.mapstruct.Mapper;

import java.util.List;


@Mapper
public interface BusinessApplicationOpenApiMapper {
    BusinessApplicationModel fromOpenApiBusinessApplication(com.backendbloom.openapi.model.BusinessApplication businessApplication);
    com.backendbloom.openapi.model.BusinessApplication businessApplicationToOpenApi(BusinessApplicationModel businessApplication);
    BusinessApplicationModel fromCreateBusinessApplicationRequestToModel(CreateBusinessApplicationRequest createBusinessApplicationRequest);
    BusinessApplicationModel fromUpdateBusinessApplicationRequest(UpdateBusinessApplicationRequest updateBusinessApplicationRequest);
    BusinessDescriptionModel fromOpenApiBusinessDescription(com.backendbloom.openapi.model.BusinessDescription businessDescription);
    com.backendbloom.openapi.model.BusinessDescription BusinessDescriptionToOpenApi(BusinessDescriptionModel businessDescription);
    BusinessLegalDocumentsModel fromOpenApiBusinessLegalDocuments(com.backendbloom.openapi.model.BusinessLegalDocuments businessLegalDocuments);
    com.backendbloom.openapi.model.BusinessLegalDocuments BusinessLegalDocumentsToOpenApi(BusinessLegalDocumentsModel businessLegalDocuments);
    BusinessPaymentDetailsModel fromOpenApiBusinessPaymentDetailsModel(com.backendbloom.openapi.model.BusinessPaymentDetails businessPaymentDetails);
    com.backendbloom.openapi.model.BusinessPaymentDetails BusinessPaymentDetailsModelToOpenApi(BusinessPaymentDetailsModel businessPaymentDetailsModel);
    BusinessContactsModel fromOpenApiBusinessBusinessContactsModel(com.backendbloom.openapi.model.BusinessContacts businessContacts);
    com.backendbloom.openapi.model.BusinessContacts BusinessContactsModelModelToOpenApi(BusinessContactsModel businessContactsModel);
    BusinessLogoModel fromOpenApiBusinessLogoModel(com.backendbloom.openapi.model.BusinessLogo businessLogoModel);
    com.backendbloom.openapi.model.BusinessLogo BusinessLogoModelToOpenApi(BusinessLogoModel businessLogoModel);
    List<BusinessApplication> BusinessApplicationListToOpenApi(List<BusinessApplicationModel> businessApplicationModels);
}
