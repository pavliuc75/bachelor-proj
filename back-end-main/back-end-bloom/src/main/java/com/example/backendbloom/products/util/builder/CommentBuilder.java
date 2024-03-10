package com.example.backendbloom.products.util.builder;

import com.example.backendbloom.products.model.comment.AuthorModel;
import com.example.backendbloom.products.model.comment.CommentModel;
import com.example.backendbloom.products.model.comment.CommentTreeNode;
import com.example.backendbloom.products.model.product.ProductModel;
import com.example.backendbloom.products.service.product.ProductService;
import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.service.user.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class CommentBuilder {

    private final AppUserService appUserService;
    private final ProductService productService;

    public CommentModel buildComment(String productId, String text, String parentNodeId) throws Exception {
        ProductModel productModel = productService.findProductById(productId);
        AppUserModel appUser = appUserService.getAppUserById(appUserService.getIdOfKeycloakUser());
        AuthorModel author = setUpAuthor(productModel, appUser);
        return setUpComment(text,author,productId,parentNodeId);
    }

    private AuthorModel setUpAuthor(ProductModel product, AppUserModel appUserModel) {
        AuthorModel author = new AuthorModel();
        author.setEmail(appUserModel.getEmail());
        author.setUserId(appUserModel.getId());
        if (product.getBelongsToBusinessId().equals(appUserModel.getBusinessId())) {
            author.setIsProductOwner(true);
        } else {
            author.setIsProductOwner(false);
        }
        return author;
    }

    private CommentModel setUpComment(String commentText, AuthorModel author, String productId, String parentNodeId) {
        CommentModel comment = new CommentModel();
        comment.setAuthor(author);
        comment.setText(commentText);
        comment.setProductTreeId(productId);
        comment.setParentId(parentNodeId);
        return comment;
    }

    public List<CommentTreeNode> assembleFullProductTree(final List<CommentTreeNode> nodes) {
        Map<String, CommentTreeNode> map = getMapWithParentChildDependencies(nodes);
        List<CommentTreeNode> topLevelNodes = new ArrayList<>();
        for (CommentTreeNode node:
             map.values()) {
            if(node.getParentId() == null) {
                topLevelNodes.add(node);
            }
        }
        topLevelNodes.sort(Comparator.comparing(CommentTreeNode::getCreatedDate));
        return topLevelNodes;
    }

    public CommentTreeNode assembleSubProductTree(final List<CommentTreeNode> nodes, final String rootNodeId) {
        Map<String, CommentTreeNode> map = getMapWithParentChildDependencies(nodes);
        return map.get(rootNodeId);
    }

    private Map<String, CommentTreeNode> getMapWithParentChildDependencies(List<CommentTreeNode> nodes) {
        final Map<String, CommentTreeNode> map = new LinkedHashMap<>();

        for (final CommentTreeNode current : nodes) {
            map.put(current.getCommentNodeId(), current);
        }

        for (final CommentTreeNode current : nodes) {
            final String parentId = current.getParentId();

            if (parentId != null) {
                final CommentTreeNode parent = map.get(parentId);
                if (parent != null) {
                    parent.addChild(current);
                    current.addParent(parent);
                }
            }
        }
        return map;
    }
}
