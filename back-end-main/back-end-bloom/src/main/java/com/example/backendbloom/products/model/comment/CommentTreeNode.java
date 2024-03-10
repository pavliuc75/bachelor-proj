package com.example.backendbloom.products.model.comment;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.joda.time.DateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Getter
@Setter
@ToString
public class CommentTreeNode {

    private String commentNodeId;

    private String productTreeId;

    private AuthorModel author;

    private String text;

    private List<CommentTreeNode> parents;

    private List<CommentTreeNode> children;

    private String parentId;

    private DateTime createdDate;

    public CommentTreeNode() {
        this.children = new ArrayList<>();
        this.parents = new ArrayList<>();
    }

    public void addChild(CommentTreeNode child) {
        if (this.children != null && !this.children.contains(child) && child != null) {
            this.children.add(child);
            children.sort(Comparator.comparing(CommentTreeNode::getCreatedDate));
        }
    }

    public void addParent(CommentTreeNode parent) {
        if (this.parents!= null && !this.parents.contains(parent) && parent != null)
            this.parents.add(parent);
    }
}
