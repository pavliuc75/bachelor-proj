package com.example.backendbloom.support.mappper.mappers;

import com.backendbloom.openapi.model.SupportThread;
import com.example.backendbloom.support.model.SupportThreadModel;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public interface SupportThreadOpenApiMapper {
    SupportThread fromSupportThreadModel(SupportThreadModel supportThreadModel);
    List<SupportThread> fromSupportThreadModelList(List<SupportThreadModel> supportThreadModelList);
}
