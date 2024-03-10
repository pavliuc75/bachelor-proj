package com.example.backendbloom.user.service.user;

import com.example.backendbloom.user.exception_handler.exception.UserNotHaveBusiness;

public interface UserBusinessService {
    String getUserBusinessId() throws UserNotHaveBusiness;

}
