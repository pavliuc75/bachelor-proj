package com.example.backendbloom.business.model;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessLegalDocumentsModel {
    private String registrationCertificateKey;
    private String registrationCertificateFileUrl;
    private String bankStatementFileKey;
    private String bankStatementFileUrl;
}
