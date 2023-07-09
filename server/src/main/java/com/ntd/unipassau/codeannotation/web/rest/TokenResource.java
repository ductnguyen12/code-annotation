package com.ntd.unipassau.codeannotation.web.rest;

import com.ntd.unipassau.codeannotation.domain.User;
import com.ntd.unipassau.codeannotation.service.TokenService;
import com.ntd.unipassau.codeannotation.web.rest.errors.BadRequestException;
import com.ntd.unipassau.codeannotation.web.rest.errors.NotFoundException;
import com.ntd.unipassau.codeannotation.web.rest.vm.AuthToken;
import com.ntd.unipassau.codeannotation.web.rest.vm.Login;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth Token Resource")
@RestController
public class TokenResource {
    private final TokenService tokenService;

    @Autowired
    public TokenResource(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Operation(summary = "Login by username and password")
    @PostMapping("/v1/auth/token")
    public AuthToken login(
            @RequestBody @Valid Login login) {
        return tokenService.login(login);
    }

    @Operation(summary = "Refresh token")
    @PostMapping("/v1/auth/refresh-token")
    public AuthToken refreshToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String refreshToken) {
        return tokenService.refreshToken(refreshToken)
                .orElseThrow(() -> new BadRequestException(
                        "Could not find user in refresh token", "AuthToken", "refreshToken"));
    }

    @Operation(summary = "Get current user's details", security = {@SecurityRequirement(name = "bearer-key")})
    @GetMapping("/v1/auth/me")
    public User getCurrentUser() {
        return tokenService.getCurrentUser()
                .orElseThrow(() -> new NotFoundException("Could not find user by id", "User", "id"));
    }
}
