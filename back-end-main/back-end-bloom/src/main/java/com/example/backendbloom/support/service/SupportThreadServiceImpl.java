package com.example.backendbloom.support.service;

import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.support.exception_handler.exception.UserAlreadyHasActiveSupportThread;
import com.example.backendbloom.support.exception_handler.exception.UserNotAuthorizedToManageThisThread;
import com.example.backendbloom.support.model.SupportThreadModel;
import com.example.backendbloom.support.repository.SupportThreadRepository;
import com.example.backendbloom.support.util.builder.SupportThreadBuilder;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class SupportThreadServiceImpl implements SupportThreadService {
    private final SupportThreadRepository supportThreadRepository;
    private final AppUserService appUserService;

    @Override
    public Page<SupportThreadModel> getPageOfActiveSupportThreads(int pageSize, int pageNumber) throws Exception {
        return supportThreadRepository.getAllByIsActive(true,PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC,"createdDate")));
    }

    @Override
    public Page<SupportThreadModel> getPageOfArchivedSupportThreads(int pageSize, int pageNumber) throws Exception {
        return supportThreadRepository.findAllByThreadAuthorIdAndIsActive(appUserService.getIdOfKeycloakUser(),
                false,
                PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC,"createdDate")));
    }

    @Override
    public SupportThreadModel createSupportThreadModel(String topic) throws Exception {
        AppUserModel appUserModel = appUserService.getCurrentUser();
        Optional<SupportThreadModel> supportThreadModelOptional = supportThreadRepository.findFirstByThreadAuthorIdAndIsActive(appUserService.getIdOfKeycloakUser(), true);
        if(supportThreadModelOptional.isPresent()) {
            throw new UserAlreadyHasActiveSupportThread(appUserService.getIdOfKeycloakUser());
        }
        return supportThreadRepository.save(SupportThreadBuilder.buildNewSupportThreadModel(topic,appUserModel));
    }

    @Override
    public SupportThreadModel getActiveSupportThreadModel(String supportThreadId) throws Exception {
        Optional<SupportThreadModel> supportThreadModelOptional = supportThreadRepository.findBySupportThreadIdAndIsActive(supportThreadId,true);
        if(!supportThreadModelOptional.isPresent()) {
            throw new ObjectNotFound("active support thread", supportThreadId);
        }
        return supportThreadModelOptional.get();
    }

    @Override
    public SupportThreadModel closeSupportThreadModel(String supportThreadId) throws Exception {
        SupportThreadModel supportThreadModel = getActiveSupportThreadModel(supportThreadId);
        AppUserModel appUserModel = appUserService.getCurrentUser();
        if (!appUserService.isUserAdmin() && !supportThreadModel.getThreadAuthorId().equals(appUserModel.getId())) {
            throw new UserNotAuthorizedToManageThisThread(supportThreadModel.getSupportThreadId(),appUserModel.getId());
        }
        supportThreadModel.setIsActive(false);
        return supportThreadRepository.save(supportThreadModel);
    }

    @Override
    public SupportThreadModel getCurrentUserActiveSupportThread() throws Exception {
        Optional<SupportThreadModel> supportThreadModelOptional = supportThreadRepository.findFirstByThreadAuthorIdAndIsActive(appUserService.getIdOfKeycloakUser(), true);
        return supportThreadModelOptional.orElse(null);
    }
}
