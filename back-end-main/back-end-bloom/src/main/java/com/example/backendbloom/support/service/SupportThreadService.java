package com.example.backendbloom.support.service;

import com.example.backendbloom.support.model.SupportThreadModel;
import org.springframework.data.domain.Page;

public interface SupportThreadService {
    Page<SupportThreadModel> getPageOfActiveSupportThreads(int pageSize, int pageNumber) throws Exception;

    Page<SupportThreadModel> getPageOfArchivedSupportThreads(int pageSize, int pageNumber) throws Exception;

    SupportThreadModel getCurrentUserActiveSupportThread() throws Exception;

    SupportThreadModel createSupportThreadModel(String Topic) throws Exception;

    SupportThreadModel getActiveSupportThreadModel(String supportThreadId) throws Exception;

    SupportThreadModel closeSupportThreadModel(String supportThreadId) throws Exception;
}
