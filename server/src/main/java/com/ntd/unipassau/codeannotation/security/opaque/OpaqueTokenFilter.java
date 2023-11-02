package com.ntd.unipassau.codeannotation.security.opaque;

import com.ntd.unipassau.codeannotation.repository.RaterRepository;
import com.ntd.unipassau.codeannotation.security.AuthoritiesConstants;
import com.ntd.unipassau.codeannotation.security.UserPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
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
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
        if (request.getCookies() != null) {
            Optional<String> tokenOpt = Arrays.stream(request.getCookies())
                    .filter(cookie -> COOKIE_TOKEN.equals(cookie.getName()))
                    .filter(cookie -> raterRepository.findById(UUID.fromString(cookie.getValue())).isPresent())
                    .findFirst()
                    .map(Cookie::getValue);
            if (authentication == null) {
                authentication = tokenOpt.map(token -> new AnonymousAuthenticationToken(
                        token, token,
                        Stream.of(AuthoritiesConstants.ANONYMOUS, AuthoritiesConstants.RATER)
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList())
                )).orElse(null);
            } else if (authentication.getPrincipal() instanceof UserPrincipal principal) {
                tokenOpt.ifPresent(token -> principal.setRaterId(UUID.fromString(token)));
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
