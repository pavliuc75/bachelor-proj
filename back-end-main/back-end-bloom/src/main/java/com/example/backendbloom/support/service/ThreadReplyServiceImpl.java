package com.example.backendbloom.support.service;

import com.backendbloom.openapi.model.SupportThread;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.support.exception_handler.exception.UserNotAuthorizedToManageThisThread;
import com.example.backendbloom.support.model.SupportThreadModel;
import com.example.backendbloom.support.model.ThreadReplyModel;
import com.example.backendbloom.support.repository.ThreadReplyRepository;
import com.example.backendbloom.support.util.builder.ThreadReplyBuilder;
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
public class ThreadReplyServiceImpl implements ThreadReplyService{
    private final ThreadReplyRepository replyRepository;
    private final SupportThreadService supportThreadService;
    private final AppUserService appUserService;

    @Override
    public Page<ThreadReplyModel> getRepliesBySupportThreadId(String supportThreadId, int pageSize, int pageNumber) throws Exception {
        SupportThreadModel supportThreadModel = supportThreadService.getActiveSupportThreadModel(supportThreadId);
        AppUserModel appUserModel = appUserService.getCurrentUser();
        if (!appUserService.isUserAdmin() && !supportThreadModel.getThreadAuthorId().equals(appUserModel.getId())) {
            throw new UserNotAuthorizedToManageThisThread(supportThreadModel.getSupportThreadId(),appUserModel.getId());
        }
        return replyRepository.findDistinctByParentThreadId(supportThreadId, PageRequest.of(pageNumber,pageSize, Sort.by(Sort.Direction.ASC,"createdDate")));
    }

    @Override
    public ThreadReplyModel createReplyForSupportThread(String text, String supportThreadId) throws Exception {
        SupportThreadModel supportThreadModel = supportThreadService.getActiveSupportThreadModel(supportThreadId);
        AppUserModel appUserModel = appUserService.getCurrentUser();
        if (!appUserService.isUserAdmin() && !supportThreadModel.getThreadAuthorId().equals(appUserModel.getId())) {
            throw new UserNotAuthorizedToManageThisThread(supportThreadModel.getSupportThreadId(),appUserModel.getId());
        }
        return replyRepository.save(ThreadReplyBuilder.buildNewThreadReply(supportThreadModel,appUserModel,text));
    }
}
