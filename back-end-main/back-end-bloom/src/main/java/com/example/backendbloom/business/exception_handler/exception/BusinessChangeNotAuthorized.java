package com.example.backendbloom.business.exception_handler.exception;

import com.backendbloom.openapi.model.Error;
import com.example.backendbloom.commons.AbstractCustomRuntimeException;
import org.springframework.http.HttpStatus;

public class BusinessChangeNotAuthorized extends AbstractCustomRuntimeException {
    public BusinessChangeNotAuthorized(String userId, String businessId) {
        super(new Error().status(HttpStatus.UNAUTHORIZED.value())
                .type(Error.TypeEnum.BUSINESS)
                .detail(String.format("User with id: %s is not owner of business/businessApplication with id: %s", userId, businessId))
                .title("Business/BusinessApplication"));
    }
}
