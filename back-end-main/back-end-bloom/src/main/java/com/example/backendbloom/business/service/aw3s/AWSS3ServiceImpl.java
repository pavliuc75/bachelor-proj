package com.example.backendbloom.business.service.aw3s;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.services.s3.model.S3Object;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AWSS3ServiceImpl implements AWSFileService {
    private final AmazonS3 awsS3Client;
    private final GcpFileValidation gcpFileValidation;

    /**
     * Builds the path for a file.
     *
     * @param folderName
     * @param fileName
     * @param file
     * @return the path folderName/fileName.extension
     */
    private String buildS3BucketKey(String folderName, String fileName, MultipartFile file) {
        String filenameExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        return String.format("%s/%s.%s", folderName, fileName, filenameExtension);
    }

    /**
     * Builds the file metadata object containing file size and content type
     *
     * @param file
     * @return
     */
    private ObjectMetadata buildFileMetadata(MultipartFile file) {
        ObjectMetadata metaData = new ObjectMetadata();
        metaData.setContentLength(file.getSize());
        metaData.setContentType(file.getContentType());
        return metaData;
    }

    /**
     * Uploads a file to S3 bucket storage.
     *
     * @param bucketName target bucket name in AWS
     * @param folderName path on which the file should be uploaded in S3 bucket
     * @param fileName   file name for uploaded file in S3 bucket
     * @param file       file which should be uploaded
     * @return string array [0] - bucket key, [1] - object URL in S3 bucket
     */
    public String[] uploadFile(String bucketName, String folderName, String fileName, MultipartFile file) throws Exception {
        gcpFileValidation.validateFileContent(file);
        String s3BucketKey = buildS3BucketKey(folderName, fileName, file);
        ObjectMetadata fileMetadata = buildFileMetadata(file);
        var putObjectRequest = new PutObjectRequest(bucketName, s3BucketKey, file.getInputStream(), fileMetadata);
        try {
            awsS3Client.putObject(putObjectRequest);
        } catch (Exception e) {
            throw new Exception(e);
        }
        String objectUrl = ((AmazonS3Client) awsS3Client).getResourceUrl(bucketName, s3BucketKey);
        return new String[]{s3BucketKey, objectUrl};
    }

    /**
     * Downloads file using amazon S3 client from S3 bucket
     *
     * @param keyName
     * @return List containing file details. [0] - ByteArrayOutputStream, [1] - File metadata
     */
    public ByteArrayOutputStream downloadFile(String bucketName, String keyName) throws Exception {
        try {
            S3Object s3object = awsS3Client.getObject(new GetObjectRequest(bucketName, keyName));
            InputStream is = s3object.getObjectContent();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            int len;
            byte[] buffer = new byte[4096];
            while ((len = is.read(buffer, 0, buffer.length)) != -1) {
                outputStream.write(buffer, 0, len);
            }
            return outputStream;
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    public boolean doesObjectExist(String bucketName, String keyName) throws Exception {
        try {
            return awsS3Client.doesObjectExist(bucketName, keyName);
        } catch (Exception e) {
            throw new Exception(e);
        }
    }
}
