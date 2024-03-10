package com.example.backendbloom.products.service.comment;

import com.example.backendbloom.products.model.comment.CommentTreeNode;
import org.springframework.beans.support.PagedListHolder;

import java.util.List;

public interface CommentService {
    List<CommentTreeNode> getFullProductTree(String productTreeId) throws Exception;

    PagedListHolder<CommentTreeNode> getPageOfProductFullTree(String productTreeId, int pageSize, int pageNumber) throws Exception;

    CommentTreeNode getSubProductTree(String productTreeId, String commentNodeId, Long maxDepth) throws Exception;

    String deleteCommentNodes(String productTreeId, String commentNodeId) throws Exception;

    CommentTreeNode createCommentNode(String productTreeId, String commentNodeId, String text) throws Exception;


}
