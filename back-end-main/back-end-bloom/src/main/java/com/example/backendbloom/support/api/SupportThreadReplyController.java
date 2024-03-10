package com.example.backendbloom.support.api;

import com.backendbloom.openapi.api.SupportThreadReplyApi;
import com.backendbloom.openapi.model.CreateNewThreadReplyRequest;
import com.backendbloom.openapi.model.ThreadReply;
import com.backendbloom.openapi.model.ThreadReplyPageResponse;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.support.exception_handler.exception.UserNotAuthorizedToManageThisThread;
import com.example.backendbloom.support.mappper.mappers.ThreadReplyOpenApiMapper;
import com.example.backendbloom.support.model.ThreadReplyModel;
import com.example.backendbloom.support.service.ThreadReplyService;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;


@RestController
@RequiredArgsConstructor
public class SupportThreadReplyController implements SupportThreadReplyApi {
    private final ThreadReplyService threadReplyService;
    private final ThreadReplyOpenApiMapper threadReplyOpenApiMapper;

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER,AppUserRole.Names.ADMIN})
    public ResponseEntity<ThreadReply> createThreadReplyForGivenThread(CreateNewThreadReplyRequest createNewThreadReplyRequest) {
        try {
            ThreadReplyModel threadReplyModel = threadReplyService.createReplyForSupportThread(createNewThreadReplyRequest.getText(),createNewThreadReplyRequest.getSupportThreadId());
            return new ResponseEntity<>(threadReplyOpenApiMapper.fromThreadReplyModel(threadReplyModel), HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound | UserNotAuthorizedToManageThisThread e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER,AppUserRole.Names.ADMIN})
    public ResponseEntity<ThreadReplyPageResponse> getThreadRepliesPage(Integer pageSize, Integer pageNumber, String threadId) {
        try {
            Page<ThreadReplyModel> repliesBySupportThreadId = threadReplyService.getRepliesBySupportThreadId(threadId,pageSize, pageNumber);
            ThreadReplyPageResponse threadReplyPageResponse = new ThreadReplyPageResponse();
            threadReplyPageResponse.setThreadReplyPageList(threadReplyOpenApiMapper.fromThreadReplyListModel(repliesBySupportThreadId.getContent()));
            threadReplyPageResponse.setTotalAmountOfPages(repliesBySupportThreadId.getTotalPages());
            threadReplyPageResponse.setTotalAmountOfElements(repliesBySupportThreadId.getTotalElements());
            return new ResponseEntity<>(threadReplyPageResponse, HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound | UserNotAuthorizedToManageThisThread e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
