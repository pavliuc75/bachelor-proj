package com.example.backendbloom.business.service.aw3s;

import com.example.backendbloom.business.exception_handler.exception.FileValidation;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GcpFileValidationImpl implements GcpFileValidation {
    @Override
    public void validateFileContent(MultipartFile file) throws IOException, FileValidation {
        SafeSearchAnnotation annotation = detectModLabels(file);
        if (annotation != null) {
            switch (annotation.getAdult()) {
                case LIKELY:
                    throw new FileValidation(Likelihood.LIKELY + " adult content");
                case VERY_LIKELY:
                    throw new FileValidation(Likelihood.VERY_LIKELY + " adult content");
            }
            switch (annotation.getMedical()) {
                case LIKELY:
                    throw new FileValidation(Likelihood.LIKELY + " medical content");
                case VERY_LIKELY:
                    throw new FileValidation(Likelihood.VERY_LIKELY + " medical content");
            }
            switch (annotation.getSpoof()) {
                case LIKELY:
                    throw new FileValidation(Likelihood.LIKELY + " spoof content");
                case VERY_LIKELY:
                    throw new FileValidation(Likelihood.VERY_LIKELY + " spoof content");
            }
            switch (annotation.getViolence()) {
                case LIKELY:
                    throw new FileValidation(Likelihood.LIKELY + " violence content");
                case VERY_LIKELY:
                    throw new FileValidation(Likelihood.VERY_LIKELY + " violence content");
            }
            switch (annotation.getRacy()) {
                case LIKELY:
                    throw new FileValidation(Likelihood.LIKELY + " racy content");
                case VERY_LIKELY:
                    throw new FileValidation(Likelihood.VERY_LIKELY + " racy content");
            }
        }

    }

    private SafeSearchAnnotation detectModLabels(MultipartFile sourceImage) throws IOException {
        List<AnnotateImageRequest> requests = new ArrayList<>();
        ByteString imgBytes = ByteString.copyFrom(sourceImage.getBytes());

        Image img = Image.newBuilder().setContent(imgBytes).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.SAFE_SEARCH_DETECTION).build();
        AnnotateImageRequest request =
                AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();
        requests.add(request);
        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();

            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    System.out.format("Error: %s%n", res.getError().getMessage());
                }

                // For full list of available annotations, see http://g.co/cloud/vision/docs
                log.info(String.format(
                        "adult: %s %d medical: %s %d spoofed: %s %d violence: %s %d racy: %s %d",
                        res.getSafeSearchAnnotation().getAdult(), res.getSafeSearchAnnotation().getAdult().getNumber(),
                        res.getSafeSearchAnnotation().getMedical(), res.getSafeSearchAnnotation().getMedical().getNumber(),
                        res.getSafeSearchAnnotation().getSpoof(), res.getSafeSearchAnnotation().getSpoof().getNumber(),
                        res.getSafeSearchAnnotation().getViolence(), res.getSafeSearchAnnotation().getViolence().getNumber(),
                        res.getSafeSearchAnnotation().getRacy(), res.getSafeSearchAnnotation().getRacy().getNumber()));
                return res.getSafeSearchAnnotation();
            }
        }
        return null;
    }
}
