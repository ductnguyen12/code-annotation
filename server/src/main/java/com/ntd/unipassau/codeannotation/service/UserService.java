package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.config.AppProperties;
import com.ntd.unipassau.codeannotation.domain.User;
import com.ntd.unipassau.codeannotation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class UserService {
    private final AppProperties appProperties;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(
            AppProperties appProperties,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.appProperties = appProperties;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createOrUpdateSuperUser() {
        AppProperties.RootUser rootUser = appProperties.getAuth().getRootUser();
        Assert.notNull(rootUser, "rootUser could not be null. Please check configuration");
        Assert.notNull(rootUser.getUsername(), "rootUser.username could not be null. Please check configuration");
        Assert.notNull(rootUser.getPassword(), "rootUser.password could not be null. Please check configuration");
        User user = userRepository.findByUsername(rootUser.getUsername())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(rootUser.getUsername());
                    newUser.setPassword(rootUser.getPassword());
                    newUser.setEnabled(true);
                    newUser.setSuperAdmin(true);
                    return newUser;
                });
        if (!passwordEncoder.matches(rootUser.getPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(rootUser.getPassword()));
            userRepository.save(user);
        }
    }
}
