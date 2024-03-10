package com.example.backendbloom.support.util.builder;

import com.example.backendbloom.support.model.SupportThreadModel;
import com.example.backendbloom.support.model.ThreadReplyAuthorModel;
import com.example.backendbloom.support.model.ThreadReplyModel;
import com.example.backendbloom.user.model.AppUserModel;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ThreadReplyBuilder {
    public static ThreadReplyModel buildNewThreadReply(SupportThreadModel supportThreadModel, AppUserModel appUserModel, String text) throws Exception {
        ThreadReplyAuthorModel threadReplyAuthorModel = setUpAuthor(supportThreadModel, appUserModel);
        ThreadReplyModel threadReplyModel = new ThreadReplyModel();
        threadReplyModel.setParentThreadId(supportThreadModel.getSupportThreadId());
        threadReplyModel.setAuthor(threadReplyAuthorModel);
        threadReplyModel.setText(text);
        return threadReplyModel;
    }

    private static ThreadReplyAuthorModel setUpAuthor(SupportThreadModel supportThreadModel, AppUserModel appUserModel) throws Exception {
        ThreadReplyAuthorModel author = new ThreadReplyAuthorModel();
        author.setEmail(appUserModel.getEmail());
        author.setUserId(appUserModel.getId());
        author.setIsCreatorOfTheThread(supportThreadModel.getThreadAuthorId().equals(appUserModel.getId()));
        return author;
    }
}
