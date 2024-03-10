package com.example.backendbloom.commons.configuration.aws;

import lombok.Getter;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
/**
 * Defines paths for S3 bucket
 */
public class BusinessS3BucketStructure {
    private final String businessPath = "business";
    private final String legalDocumentsPath ="legalDocuments";
    private final String logoPath ="logo";
    private final String registrationCertificateFileName = "registrationCertificate";
    private final String bankStatementFileName = "bankStatement";

    public String buildBusinessApplicationLegalDocumentsPath(String username){
        return String.format("%s/%s/%s", businessPath,username, legalDocumentsPath);
    }
    public String buildBusinessLogoPath(String username){
        return String.format("%s/%s/%s", businessPath,username, logoPath);
    }
}
