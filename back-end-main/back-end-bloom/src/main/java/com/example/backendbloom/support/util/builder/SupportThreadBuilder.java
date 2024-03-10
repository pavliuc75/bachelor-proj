package com.example.backendbloom.support.util.builder;

import com.example.backendbloom.support.model.SupportThreadModel;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.UtilityClass;
import org.springframework.stereotype.Component;

@UtilityClass
public class SupportThreadBuilder {

    public static SupportThreadModel buildNewSupportThreadModel(String topic, AppUserModel appUser) throws Exception {
        SupportThreadModel newSupportThreadModel = new SupportThreadModel();
        newSupportThreadModel.setThreadAuthorId(appUser.getId());
        newSupportThreadModel.setThreadAuthorEmail(appUser.getEmail());
        newSupportThreadModel.setThreadTopic(topic);
        newSupportThreadModel.setIsActive(true);

        return newSupportThreadModel;
    }

}
