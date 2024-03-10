package com.example.backendbloom.products.service.comment;

import lombok.var;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CommentServiceImplTest {
    private final CommentService commentService;

    @Autowired
    public CommentServiceImplTest(CommentService commentService) {
        this.commentService = commentService;
    }
    @Test
    void getFullProductTree() throws Exception {
        var Result = commentService.getFullProductTree("6384eeafc9b09c7f1071d155");
    }

    @Test
    void getSubProductTree() throws Exception {
        var Result = commentService.getSubProductTree("6384eeafc9b09c7f1071d155","6389c1c80d9acf15f2ca802e",1000L);
    }
}