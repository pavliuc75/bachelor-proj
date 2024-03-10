package com.example.backendbloom;

import com.example.backendbloom.user.model.AppUserModel;
import com.example.backendbloom.user.repository.AppUserRepository;
import lombok.var;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional("transactionManager")
class BackEndBloomApplicationTests {

    private final AppUserRepository appUserRepository;

    @Autowired
    public BackEndBloomApplicationTests(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Test
    @Transactional
    void checkTransactionNotWorking() {
        AppUserModel appUser = new AppUserModel();
        appUser.setFirstName("Land");
        appUserRepository.save(appUser);
        appUser.setFirstName("Band");
        appUserRepository.save(appUser);
    }

    @Test
    @Transactional
    void checkTransactionWorking() {
        AppUserModel appUser = new AppUserModel();
        appUser.setFirstName("Gand");
        var d = appUserRepository.save(appUser);
        appUser.setFirstName("Sand");
        var c = appUserRepository.save(appUser);
        var l = appUserRepository.findById(c.getId());
        assertEquals("Sand",l.get().getFirstName());
    }
}
