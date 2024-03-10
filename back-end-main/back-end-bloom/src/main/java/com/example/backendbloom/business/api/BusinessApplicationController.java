package com.example.backendbloom.business.api;

import com.backendbloom.openapi.api.BusinessApplicationApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.business.exception_handler.exception.BusinessChangeNotAuthorized;
import com.example.backendbloom.business.exception_handler.exception.FileValidation;
import com.example.backendbloom.commons.configuration_propereties.cloud.AWSS3Buckets;
import com.example.backendbloom.business.exception_handler.exception.BusinessFileNotFound;
import com.example.backendbloom.business.mapper.application.BusinessApplicationOpenApiMapper;
import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.BusinessLegalDocumentsModel;
import com.example.backendbloom.business.model.BusinessLogoModel;
import com.example.backendbloom.business.service.application.BusinessApplicationService;
import com.example.backendbloom.business.service.aw3s.AWSFileService;
import com.example.backendbloom.business.service.application.ApplicationTransactionalService;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.RolesAllowed;
import java.io.ByteArrayOutputStream;


@Slf4j
@RestController
@RequiredArgsConstructor
public class BusinessApplicationController implements BusinessApplicationApi {
    private final BusinessApplicationService businessApplicationService;
    private final BusinessApplicationOpenApiMapper businessApplicationOpenApiMapper;

    private final ApplicationTransactionalService applicationTransactionalService;
    private final AWSFileService fileService;
    private final AWSS3Buckets aws3Bucket;


    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER})
    public ResponseEntity<Resource> downloadLegalDocument(String fileKeyBase64Encoded) {
        try {
            byte[] valueDecoded = Base64.decodeBase64(fileKeyBase64Encoded.getBytes());
            String fileKey = new String(valueDecoded).trim();
            ByteArrayOutputStream fileByteOutputStream = fileService.downloadFile(aws3Bucket.getBusiness(), fileKey);
            String fileName = FilenameUtils.getName(fileKey);
            Resource resource = new ByteArrayResource(fileByteOutputStream.toByteArray());
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER})
    public ResponseEntity<BusinessLegalDocuments> uploadLegalDocuments(MultipartFile registrationCertificateFile, MultipartFile bankStatementFile) {
        try {
            BusinessLegalDocumentsModel businessLegalDocumentsModel = businessApplicationService.uploadLegalDocuments(registrationCertificateFile, bankStatementFile);
            return new ResponseEntity<>(businessApplicationOpenApiMapper.BusinessLegalDocumentsToOpenApi(businessLegalDocumentsModel),
                    HttpStatus.CREATED);
        } catch (DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }


    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER})
    public ResponseEntity<BusinessApplication> createBusinessApplication(CreateBusinessApplicationRequest createBusinessApplicationRequest) {
        try {
            BusinessApplicationModel businessApplication = businessApplicationOpenApiMapper.fromCreateBusinessApplicationRequestToModel(createBusinessApplicationRequest);
            BusinessApplicationModel createdApplication = applicationTransactionalService.createBusinessApplication(businessApplication);
            return new ResponseEntity<>(businessApplicationOpenApiMapper.businessApplicationToOpenApi(createdApplication),
                    HttpStatus.CREATED);
        } catch (BusinessFileNotFound | DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.BUSINESS_OWNER})
    public ResponseEntity<BusinessApplication> updateBusinessApplication(UpdateBusinessApplicationRequest updateBusinessApplicationRequest) {
        try {
            BusinessApplicationModel businessApplicationModel = businessApplicationOpenApiMapper.fromUpdateBusinessApplicationRequest(updateBusinessApplicationRequest);
            BusinessApplicationModel createdApplication = applicationTransactionalService.updateBusinessApplication(businessApplicationModel);
            return new ResponseEntity<>(businessApplicationOpenApiMapper.businessApplicationToOpenApi(createdApplication),
                    HttpStatus.OK);
        } catch (BusinessFileNotFound | BusinessChangeNotAuthorized | DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<BusinessApplicationListResponse> getBusinessApplicationList(Integer pageSize, Integer pageNumber) {
        try {
            Page<BusinessApplicationModel> result = businessApplicationService.getBusinessApplicationList(pageNumber, pageSize);
            BusinessApplicationListResponse response = new BusinessApplicationListResponse();
            response.setBusinessApplicationPageList(businessApplicationOpenApiMapper.BusinessApplicationListToOpenApi(result.toList()));
            response.setTotalAmountOfElements(result.getTotalElements());
            response.setTotalAmountOfPages(result.getTotalPages());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER})
    public ResponseEntity<BusinessLogo> uploadCompanyLogo(MultipartFile logoFile) {
        try {
            BusinessLogoModel businessLogoModel = businessApplicationService.uploadLogo(logoFile);
            return new ResponseEntity<>(businessApplicationOpenApiMapper.BusinessLogoModelToOpenApi(businessLogoModel),
                    HttpStatus.CREATED);
        } catch (FileValidation| DefaultServerException e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<BusinessApplication> getBusinessApplicationById(String businessApplicationId) {
        try {
            BusinessApplicationModel resultBusinessApplication = businessApplicationService.getBusinessApplicationById(businessApplicationId);
            return new ResponseEntity<>(businessApplicationOpenApiMapper.businessApplicationToOpenApi(resultBusinessApplication),
                    HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
