package com.example.backendbloom.business.service.aw3s;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface GcpFileValidation {
    void validateFileContent(MultipartFile file) throws IOException;
}
