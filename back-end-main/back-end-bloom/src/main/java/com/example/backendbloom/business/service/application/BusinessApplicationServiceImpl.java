package com.example.backendbloom.business.service.application;


import com.backendbloom.openapi.model.BusinessApplicationState;
import com.example.backendbloom.business.exception_handler.exception.FileValidation;
import com.example.backendbloom.commons.configuration.aws.BusinessS3BucketStructure;
import com.example.backendbloom.commons.configuration.aws.ProductsS3BucketStructure;
import com.example.backendbloom.commons.configuration_propereties.cloud.AWSS3Buckets;
import com.example.backendbloom.business.exception_handler.exception.BusinessFileNotFound;
import com.example.backendbloom.business.model.application.BusinessApplicationModel;
import com.example.backendbloom.business.model.BusinessLegalDocumentsModel;
import com.example.backendbloom.business.model.BusinessLogoModel;
import com.example.backendbloom.business.repository.BusinessApplicationRepository;
import com.example.backendbloom.business.service.aw3s.AWSFileService;
import com.example.backendbloom.commons.configuration.KeycloakAuthorizedUser;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusinessApplicationServiceImpl implements BusinessApplicationService {
    private final BusinessApplicationRepository businessApplicationRepository;
    private final AWSFileService fileService;
    private final AWSS3Buckets awss3Bucket;
    private final KeycloakAuthorizedUser keycloakAuthorizedUser;

    @Override
    public BusinessApplicationModel createOrUpdateBusinessApplication(BusinessApplicationModel businessApplication) throws Exception {
        validateLegalDocuments(businessApplication.getBusinessLegalDocuments());
        if (businessApplication.getBusinessLogo() != null) {
            validateLogoFile(businessApplication.getBusinessLogo());
        }
        return businessApplicationRepository.save(businessApplication);

    }

    @Override
    public BusinessLegalDocumentsModel uploadLegalDocuments(MultipartFile registrationCertificateFile, MultipartFile bankStatementFile) throws Exception {
        String userUsername = keycloakAuthorizedUser.getUserEmail();
        BusinessS3BucketStructure awss3BucketStructure = awss3Bucket.getBusinessS3BucketStructure();
        String s3BucketFolderName = awss3Bucket.getBusinessS3BucketStructure().buildBusinessApplicationLegalDocumentsPath(userUsername);
        try {
            String[] registrationCertificateKeyUrl = fileService.uploadFile(awss3Bucket.getBusiness(),
                    s3BucketFolderName,
                    awss3BucketStructure.getRegistrationCertificateFileName(),
                    registrationCertificateFile);
            String[] bankStatementCertificateKeyUrl = fileService.uploadFile(awss3Bucket.getBusiness(),
                    s3BucketFolderName,
                    awss3BucketStructure.getBankStatementFileName(),
                    bankStatementFile);
            return new BusinessLegalDocumentsModel(
                    registrationCertificateKeyUrl[0],
                    registrationCertificateKeyUrl[1],
                    bankStatementCertificateKeyUrl[0],
                    bankStatementCertificateKeyUrl[1]);
        } catch (FileValidation | BusinessFileNotFound ex) {
            throw ex;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public BusinessLogoModel uploadLogo(MultipartFile logoFile) throws Exception {
        String userUsername = keycloakAuthorizedUser.getUserEmail();
        ProductsS3BucketStructure awss3BucketStructure = awss3Bucket.getProductsS3BucketStructure();
        String s3BucketFolderName = awss3BucketStructure.buildLogoPath(userUsername);
        String[] logoFileKeyUrl = fileService.uploadFile(awss3Bucket.getProduct(),
                s3BucketFolderName,
                UUID.randomUUID().toString(),
                logoFile);
        return new BusinessLogoModel(
                logoFileKeyUrl[0],
                logoFileKeyUrl[1]);
    }

    @Override
    public Page<BusinessApplicationModel> getBusinessApplicationList(int pageNumber, int pageSize) {
        return businessApplicationRepository.findBy(BusinessApplicationState.INREVIEW, PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdDate")));
    }

    @Override
    public Boolean isBusinessApplicationExistsById(String id) {
        return businessApplicationRepository.existsById(id);
    }

    private void validateLegalDocuments(BusinessLegalDocumentsModel businessLegalDocuments) throws Exception {
        boolean bankStatementFileExists = fileService.doesObjectExist(awss3Bucket.getBusiness(), businessLegalDocuments.getBankStatementFileKey());
        boolean registrationCertFileExists = fileService.doesObjectExist(awss3Bucket.getBusiness(), businessLegalDocuments.getRegistrationCertificateKey());
        if (!(bankStatementFileExists && registrationCertFileExists)) {
            throw new BusinessFileNotFound(businessLegalDocuments.getBankStatementFileKey() + " or " + businessLegalDocuments.getBankStatementFileKey());
        }
    }

    private void validateLogoFile(BusinessLogoModel businessLogoModel) throws Exception {
        try {
            boolean logoFileExists = fileService.doesObjectExist(awss3Bucket.getProduct(), businessLogoModel.getLogoKey());
//          logoFileExistsInBusinessBocket  For backwards compatibility
            boolean logoFileExistsInBusinessBocket = fileService.doesObjectExist(awss3Bucket.getBusiness(), businessLogoModel.getLogoKey());
            if (!(logoFileExistsInBusinessBocket || logoFileExists)) {
                throw new BusinessFileNotFound(businessLogoModel.getLogoKey());
            }
        } catch (BusinessFileNotFound ex) {
            throw ex;
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    @Override
    public BusinessApplicationModel getBusinessApplicationById(String businessApplicationId) {
        Optional<BusinessApplicationModel> businessApplication = businessApplicationRepository.findById(businessApplicationId);
        if (businessApplication.isPresent())
            return businessApplication.get();
        else throw new ObjectNotFound("businessApplication", businessApplicationId);
        //TODO: throw custom exception
    }
}
