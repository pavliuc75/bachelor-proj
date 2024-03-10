package com.example.backendbloom.commons.util;

import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ValidationUtil {
    public void validatePagination(int pageSize, int pageNumber) throws ValueNotGreaterThanZero, ValueNotPositive{
        if (pageSize <= 0) {
            throw new ValueNotGreaterThanZero("Page Size");
        }
        if (pageNumber < 0) {
            throw new ValueNotPositive("Page Number");
        }
    }
}
