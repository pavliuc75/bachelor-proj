package com.example.backendbloom.products.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class CategoryNotFound extends AbstractCustomRuntimeException {
    public CategoryNotFound(String id) {
        super(new Error().status(HttpStatus.NOT_FOUND.value())
                .type(Error.TypeEnum.VALIDATION)
                .detail(String.format("Category with id '%s' was not found. Make sure the category was created beforehand", id))
                .title("Category"));
    }
}
