package com.ntd.unipassau.codeannotation.security;

import com.ntd.unipassau.codeannotation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserDetailsMapper userDetailsMapper;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository, UserDetailsMapper userDetailsMapper) {
        this.userRepository = userRepository;
        this.userDetailsMapper = userDetailsMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .map(userDetailsMapper::toUserPrincipal)
                .map(principal -> {
                    principal.addAuthorities(List.of(AuthoritiesConstants.USER));
                    return principal;
                })
                .orElseThrow(() -> new UsernameNotFoundException("Could not find user by username: " + username));
    }
}
