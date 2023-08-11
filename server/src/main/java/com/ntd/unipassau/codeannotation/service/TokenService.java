package com.ntd.unipassau.codeannotation.service;

import com.ntd.unipassau.codeannotation.domain.User;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.repository.UserRepository;
import com.ntd.unipassau.codeannotation.security.SecurityUtils;
import com.ntd.unipassau.codeannotation.security.UserPrincipal;
import com.ntd.unipassau.codeannotation.security.jwt.JwtTokenProvider;
import com.ntd.unipassau.codeannotation.web.rest.vm.AuthToken;
import com.ntd.unipassau.codeannotation.web.rest.vm.Login;
import com.ntd.unipassau.codeannotation.web.rest.vm.UserVM;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class TokenService {
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final RaterRepository raterRepository;

    @Autowired
    public TokenService(
            JwtTokenProvider tokenProvider,
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            UserDetailsService userDetailsService,
            RaterRepository raterRepository) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.raterRepository = raterRepository;
    }

    public AuthToken login(Login login) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.getUsername(),
                        login.getPassword()
                ));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return tokenProvider.generateToken(authentication);
    }

    public Optional<AuthToken> refreshToken(String refreshToken) {
        if (refreshToken.split(" ")[0].trim().equalsIgnoreCase(JwtTokenProvider.TOKEN_BEARER)) {
            refreshToken = refreshToken.split(" ")[1].trim();
        }
        final String finalRefreshToken = refreshToken;
        return tokenProvider.extractToken(finalRefreshToken)
                .map(claims -> claims.get(JwtTokenProvider.CLAIMS_USERNAME).toString())
                .map(userDetailsService::loadUserByUsername)
                .map(userDetails -> tokenProvider.generateToken((UserPrincipal) userDetails));
    }

    public Optional<UserVM> getCurrentUser() {
        return SecurityUtils.getCurrentUser()
                .map(UserPrincipal.class::cast)
                .flatMap(principal -> userRepository.findById(principal.getId())
                        .map(user -> {
                            UUID raterId = raterRepository.findByUserId(user.getId())
                                    .map(rater -> rater.getId())
                                    .orElse(principal.getRaterId());
                            UserVM userVM = new UserVM();
                            BeanUtils.copyProperties(user, userVM);
                            userVM.setRaterId(raterId);
                            return userVM;
                        }));
    }
}
