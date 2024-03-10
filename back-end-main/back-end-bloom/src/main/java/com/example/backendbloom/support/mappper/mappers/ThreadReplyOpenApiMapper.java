package com.example.backendbloom.support.mappper.mappers;

import com.backendbloom.openapi.model.ThreadReply;
import com.backendbloom.openapi.model.ThreadReplyAuthor;
import com.example.backendbloom.support.model.ThreadReplyAuthorModel;
import com.example.backendbloom.support.model.ThreadReplyModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface ThreadReplyOpenApiMapper {
    ThreadReply fromThreadReplyModel(ThreadReplyModel threadReplyModel);
    ThreadReplyAuthor fromThreadReplyAuthorModel(ThreadReplyAuthorModel threadReplyAuthorModel);
    List<ThreadReply> fromThreadReplyListModel(List<ThreadReplyModel> threadReplyModels);
}
