package com.example.backendbloom.products.mapper.mappers;

import com.backendbloom.openapi.model.Author;
import com.backendbloom.openapi.model.Comment;
import com.example.backendbloom.products.model.comment.AuthorModel;
import com.example.backendbloom.products.model.comment.CommentModel;
import com.example.backendbloom.products.model.comment.CommentTreeNode;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface CommentOpenApiMapper {
    Comment fromCommentNodeModel(CommentTreeNode commentTreeNode);
    Author fromAuthorModel(AuthorModel authorModel);

    CommentTreeNode fromCommentModelToNode(CommentModel commentModel);

    List<CommentTreeNode> fromCommentModelListToNode(List<CommentModel> commentModels);

    List<Comment> fromCommentNodeToOpenApiModel(List<CommentTreeNode> commentTreeNodes);
}
