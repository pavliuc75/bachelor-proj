package com.example.backendbloom.support.service;

import com.example.backendbloom.support.model.ThreadReplyModel;
import org.springframework.data.domain.Page;

public interface ThreadReplyService {
    Page<ThreadReplyModel> getRepliesBySupportThreadId(String supportThreadId, int pageSize, int pageNumber) throws Exception;
    ThreadReplyModel createReplyForSupportThread(String text, String supportThreadId) throws Exception;
}
