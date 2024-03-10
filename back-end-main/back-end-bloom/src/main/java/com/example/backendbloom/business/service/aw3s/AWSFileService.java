package com.example.backendbloom.business.service.aw3s;

import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public interface AWSFileService {
    String[] uploadFile(String bucketName, String folderName, String fileName, MultipartFile file) throws Exception;
    ByteArrayOutputStream downloadFile(String bucketName, String keyName) throws Exception;

    boolean doesObjectExist(String bucketName, String keyName) throws Exception;

}
