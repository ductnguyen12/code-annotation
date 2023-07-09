package com.ntd.unipassau.codeannotation;

import com.ntd.unipassau.codeannotation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ApplicationStartup {
    private final UserService userService;


    @Autowired
    public ApplicationStartup(UserService userService) {
        this.userService = userService;
    }

    @Bean
    public CommandLineRunner initSuperUser() {
        return (args) -> userService.createOrUpdateSuperUser();
    }
}
