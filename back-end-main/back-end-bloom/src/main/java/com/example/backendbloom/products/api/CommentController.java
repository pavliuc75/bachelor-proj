package com.example.backendbloom.products.api;

import com.backendbloom.openapi.api.CommentApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.products.mapper.mappers.CommentOpenApiMapper;
import com.example.backendbloom.products.model.comment.CommentTreeNode;
import com.example.backendbloom.products.service.comment.CommentService;
import com.example.backendbloom.user.model.AppUserRole;
import com.fasterxml.jackson.jaxrs.json.annotation.JSONP;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController implements CommentApi {
    private final CommentOpenApiMapper commentOpenApiMapper;
    private final CommentService commentService;

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER,AppUserRole.Names.BUSINESS_OWNER,AppUserRole.Names.ADMIN})
    public ResponseEntity<Comment> createNewComment(CreateNewCommentRequest createNewCommentRequest) {
        try {
            CommentTreeNode result = commentService.createCommentNode(createNewCommentRequest.getProductId(),null,createNewCommentRequest.getText());
            return new ResponseEntity<>(commentOpenApiMapper.fromCommentNodeModel(result),HttpStatus.CREATED);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER,AppUserRole.Names.BUSINESS_OWNER,AppUserRole.Names.ADMIN})
    public ResponseEntity<Comment> createNewCommentReply(CreateNewCommentReplyRequest createNewCommentReplyRequest) {
        try {
            CommentTreeNode result = commentService.createCommentNode(createNewCommentReplyRequest.getProductId(),createNewCommentReplyRequest.getTargetCommentId(),createNewCommentReplyRequest.getText());
            return new ResponseEntity<>(commentOpenApiMapper.fromCommentNodeModel(result),HttpStatus.CREATED);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    public ResponseEntity<CommentTreeListResponse> getCommentTreeListForProduct(Integer pageSize, Integer pageNumber, String productId) {
        try {
            PagedListHolder<CommentTreeNode> commentTreeNodePage = commentService.getPageOfProductFullTree(productId,pageSize,pageNumber);
            CommentTreeListResponse commentTreeListResponse = new CommentTreeListResponse();
            commentTreeListResponse.setCommentTreeList(commentOpenApiMapper.fromCommentNodeToOpenApiModel(commentTreeNodePage.getPageList()));
            commentTreeListResponse.setTotalAmountOfElements((long) commentTreeNodePage.getNrOfElements());
            commentTreeListResponse.setTotalAmountOfPage(commentTreeNodePage.getPageCount());
            return new ResponseEntity<>(commentTreeListResponse,HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
