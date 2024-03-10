package com.example.backendbloom.support.api;

import com.backendbloom.openapi.api.SupportThreadApi;
import com.backendbloom.openapi.model.*;
import com.example.backendbloom.commons.exception_handler.exception.DefaultServerException;
import com.example.backendbloom.commons.exception_handler.exception.ObjectNotFound;
import com.example.backendbloom.support.exception_handler.exception.UserAlreadyHasActiveSupportThread;
import com.example.backendbloom.support.exception_handler.exception.UserNotAuthorizedToManageThisThread;
import com.example.backendbloom.support.mappper.mappers.SupportThreadOpenApiMapper;
import com.example.backendbloom.support.model.SupportThreadModel;
import com.example.backendbloom.support.service.SupportThreadService;
import com.example.backendbloom.user.model.AppUserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@RestController
@RequiredArgsConstructor
public class SupportThreadController implements SupportThreadApi {

    private final SupportThreadService supportThreadService;
    private final SupportThreadOpenApiMapper supportThreadOpenApiMapper;

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER,AppUserRole.Names.ADMIN})
    public ResponseEntity<SupportThread> closeSupportThread(CloseSupportThreadRequest closeSupportThreadRequest) {
        try {
            SupportThreadModel supportThreadModel = supportThreadService.closeSupportThreadModel(closeSupportThreadRequest.getSupportThreadId());
            return new ResponseEntity<>(supportThreadOpenApiMapper.fromSupportThreadModel(supportThreadModel), HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound | UserNotAuthorizedToManageThisThread e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER})
    public ResponseEntity<SupportThread> createSupportThread(CreateNewSupportThreadRequest createNewSupportThreadRequest) {
       try {
           SupportThreadModel supportThreadModel = supportThreadService.createSupportThreadModel(createNewSupportThreadRequest.getTopic());
           return new ResponseEntity<>(supportThreadOpenApiMapper.fromSupportThreadModel(supportThreadModel), HttpStatus.OK);
       } catch (DefaultServerException | ObjectNotFound | UserAlreadyHasActiveSupportThread e) {
           throw e;
       } catch (Exception e) {
           throw new DefaultServerException(e);
       }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.ADMIN})
    public ResponseEntity<SupportThreadPageResponse> getActiveSupportThreadPage(Integer pageSize, Integer pageNumber) {
        try {
            Page<SupportThreadModel> supportThreadModelPage = supportThreadService.getPageOfActiveSupportThreads(pageSize,pageNumber);
            SupportThreadPageResponse response = new SupportThreadPageResponse();
            response.setSupportThreadPageList(supportThreadOpenApiMapper.fromSupportThreadModelList(supportThreadModelPage.getContent()));
            response.setTotalAmountOfPages(supportThreadModelPage.getTotalPages());
            response.setTotalAmountOfElements(supportThreadModelPage.getTotalElements());
            return new ResponseEntity<>(response,HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound | UserNotAuthorizedToManageThisThread e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER})
    public ResponseEntity<SupportThreadPageResponse> getArchivedSupportThreadPage(Integer pageSize, Integer pageNumber) {
        try {
            Page<SupportThreadModel> supportThreadModelPage = supportThreadService.getPageOfArchivedSupportThreads(pageSize,pageNumber);
            SupportThreadPageResponse response = new SupportThreadPageResponse();
            response.setSupportThreadPageList(supportThreadOpenApiMapper.fromSupportThreadModelList(supportThreadModelPage.getContent()));
            response.setTotalAmountOfPages(supportThreadModelPage.getTotalPages());
            response.setTotalAmountOfElements(supportThreadModelPage.getTotalElements());
            return new ResponseEntity<>(response,HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound | UserNotAuthorizedToManageThisThread e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }

    @Override
    @RolesAllowed({AppUserRole.Names.CUSTOMER})
    public ResponseEntity<SupportThread> getActiveSupportThreadForCurrentUser() {
        try {
            SupportThreadModel supportThreadModel = supportThreadService.getCurrentUserActiveSupportThread();
            return new ResponseEntity<>(supportThreadOpenApiMapper.fromSupportThreadModel(supportThreadModel), HttpStatus.OK);
        } catch (DefaultServerException | ObjectNotFound  e) {
            throw e;
        } catch (Exception e) {
            throw new DefaultServerException(e);
        }
    }
}
