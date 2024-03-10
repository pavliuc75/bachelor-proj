package com.example.backendbloom.products.service.comment;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.products.mapper.mappers.CommentOpenApiMapper;
import com.example.backendbloom.products.model.comment.CommentModel;
import com.example.backendbloom.products.model.comment.CommentTreeNode;
import com.example.backendbloom.products.repository.CommentRepository;
import com.example.backendbloom.products.util.builder.CommentBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentBuilder commentBuilder;
    private final CommentOpenApiMapper commentOpenApiMapper;

    @Override
    public List<CommentTreeNode> getFullProductTree(String productTreeId) throws Exception {
        Optional<List<CommentModel>> commentModels = commentRepository.findDistinctByProductTreeId(productTreeId);
        if (!commentModels.isPresent()) {
            throw new ObjectNotFound("product comment tree",productTreeId);
        }
        return commentBuilder.assembleFullProductTree(commentOpenApiMapper.fromCommentModelListToNode(commentModels.get()));
    }

    @Override
    public PagedListHolder<CommentTreeNode> getPageOfProductFullTree(String productTreeId, int pageSize, int pageNumber) throws Exception {
        List<CommentTreeNode> commentTreeNodes = getFullProductTree(productTreeId);
        PagedListHolder<CommentTreeNode> commentTreeNodePage = new PagedListHolder<>(commentTreeNodes);
        commentTreeNodePage.setPageSize(pageSize);
        commentTreeNodePage.setPage(pageNumber);
        return commentTreeNodePage;
    }

    @Override
    public CommentTreeNode getSubProductTree(String productTreeId, String commentNodeId, Long maxDepth) {
        Optional<List<CommentModel>> commentModelsWrapper = commentRepository.findDistinctByProductTreeId(productTreeId);
        if (!commentModelsWrapper.isPresent()) {
            throw new ObjectNotFound("product comment tree",productTreeId);
        }
        return commentBuilder.assembleSubProductTree(commentOpenApiMapper.fromCommentModelListToNode(commentModelsWrapper.get()),commentNodeId);
    }

    @Override
    public String deleteCommentNodes(String productTreeId, String commentNodeId) {
        return null;
    }

    @Override
    public CommentTreeNode createCommentNode(String productTreeId, String parentCommentNodeId, String text) throws Exception{
        if (parentCommentNodeId != null) {
            Optional<CommentModel> commentModel = commentRepository.findById(parentCommentNodeId);
            if (!commentModel.isPresent())
                throw new ObjectNotFound("The parent of reply comment", parentCommentNodeId);
        }
        CommentModel commentModel = commentBuilder.buildComment(productTreeId,text, parentCommentNodeId);
        CommentModel result = commentRepository.save(commentModel);
        return commentOpenApiMapper.fromCommentModelToNode(result);
    }
}
