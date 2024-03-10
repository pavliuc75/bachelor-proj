package com.example.backendbloom.business.service.application;

import com.backendbloom.openapi.model.BusinessApplication;
import com.backendbloom.openapi.model.BusinessApplicationState;
import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.BusinessLegalDocumentsModel;
import com.example.backendbloom.business.model.BusinessLogoModel;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BusinessApplicationService {



    BusinessApplicationModel createOrUpdateBusinessApplication(BusinessApplicationModel businessApplication) throws Exception;

    BusinessLegalDocumentsModel uploadLegalDocuments(MultipartFile registrationCertificateFile, MultipartFile bankStatementFile) throws Exception;

    BusinessLogoModel uploadLogo(MultipartFile logoFile) throws Exception;

    Page<BusinessApplicationModel> getBusinessApplicationList(int pageNumber, int pageSize) throws Exception;

    BusinessApplicationModel getBusinessApplicationById(String businessApplicationId) throws Exception;

    Boolean isBusinessApplicationExistsById(String id) throws Exception;

}
