package com.example.backendbloom.commons;

import com.backendbloom.openapi.model.Error;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public abstract class AbstractCustomRuntimeException extends RuntimeException {
    private final Error exceptionError;
}
