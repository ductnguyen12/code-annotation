package com.ntd.unipassau.codeannotation.security.opaque;

import com.ntd.unipassau.codeannotation.domain.User;
import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.repository.UserRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

@Component
public class OpaqueTokenFilter extends OncePerRequestFilter {

    private final static String COOKIE_TOKEN = "token";

    private final RaterRepository raterRepository;

    @Autowired
    public OpaqueTokenFilter(RaterRepository raterRepository) {
        this.raterRepository = raterRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null && request.getCookies() != null) {
            authentication = Arrays.stream(request.getCookies())
                    .filter(cookie -> COOKIE_TOKEN.equals(cookie.getName()))
                    .filter(cookie -> raterRepository.findById(UUID.fromString(cookie.getValue())).isPresent())
                    .map(cookie -> new AnonymousAuthenticationToken(
                            cookie.getValue(), cookie.getValue(),
                            Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.ANONYMOUS))
                    ))
                    .findFirst()
                    .orElse(null);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
