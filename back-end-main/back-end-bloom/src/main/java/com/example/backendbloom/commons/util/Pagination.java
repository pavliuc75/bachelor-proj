package com.example.backendbloom.commons.util;

import com.example.backendbloom.commons.exception_handler.exception.ValueNotGreaterThanZero;
import com.example.backendbloom.commons.exception_handler.exception.ValueNotPositive;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;

@UtilityClass
public class Pagination {

    public static <T> Page<T> paginateList(List<T> sourceList, int pageNumber, int pageSize)throws ValueNotGreaterThanZero, ValueNotPositive {
        ValidationUtil.validatePagination(pageSize, pageNumber);
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), sourceList.size());
        return new PageImpl<>(sourceList.subList(start, end), pageable, sourceList.size());
    }
}
