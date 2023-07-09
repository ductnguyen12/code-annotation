package com.ntd.unipassau.codeannotation.security.jwt;

import com.ntd.unipassau.codeannotation.config.AppProperties;
import com.ntd.unipassau.codeannotation.security.UserPrincipal;
import com.ntd.unipassau.codeannotation.web.rest.vm.AuthToken;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
@Slf4j
public class JwtTokenProvider {
    private static final String HEADER_STRING = "Authorization";
    public static final String TOKEN_BEARER = "Bearer";
    public static final String TOKEN_REFRESH = "Refresh";
    public static final String TOKEN_PREFIX = TOKEN_BEARER + " ";

    public final static String CLAIMS_SUBJECT = Claims.SUBJECT;
    public static final String CLAIMS_TYPE = "typ";
    public static final String CLAIMS_SESSION = "sid";
    public static final String CLAIMS_USERNAME = "username";
    public static final String CLAIMS_NAME = "name";
    public static final String CLAIMS_ENABLED = "enabled";
    public static final String CLAIMS_SUPER_ADMIN = "superAdmin";

    private final AppProperties.Auth authProperties;
    private final SecretKey signKey;

    @Autowired
    public JwtTokenProvider(AppProperties appProperties) {
        this.authProperties = appProperties.getAuth();

        byte[] keyBytes = Decoders.BASE64.decode(authProperties.getTokenSecret());
        this.signKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader(HEADER_STRING);
        if (bearerToken != null && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public AuthToken generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return generateToken(userPrincipal);
    }

    public AuthToken generateToken(UserPrincipal userPrincipal) {
        String sessionId = UUID.randomUUID().toString();
        Instant iat = Instant.now();

        return AuthToken.builder()
                .accessToken(createAccessToken(sessionId, iat, userPrincipal))
                .refreshToken(createRefreshToken(sessionId, iat, userPrincipal))
                .tokenType(TOKEN_BEARER)
                .expiresIn(authProperties.getTokenExpiration())
                .refreshExpiresIn(authProperties.getRefreshExpiration())
                .build();
    }

    public Optional<Map<String, Object>> extractToken(String authToken) {
        try {
            Claims claims = decodeToken(authToken);
            Map<String, Object> result = new HashMap<>();
            result.put(Claims.ID, claims.getId());
            result.put(Claims.SUBJECT, claims.getSubject());
            result.put(Claims.ISSUED_AT, claims.getIssuedAt());
            result.put(Claims.EXPIRATION, claims.getExpiration());
            result.put(CLAIMS_TYPE, claims.getOrDefault(CLAIMS_TYPE, TOKEN_BEARER));
            result.put(CLAIMS_SESSION, claims.getOrDefault(CLAIMS_SESSION, null));
            result.put(CLAIMS_USERNAME, claims.getOrDefault(CLAIMS_USERNAME, null));
            result.put(CLAIMS_NAME, claims.getOrDefault(CLAIMS_NAME, null));
            result.put(CLAIMS_SUPER_ADMIN, claims.getOrDefault(CLAIMS_SUPER_ADMIN, false));
            result.put(CLAIMS_ENABLED, claims.getOrDefault(CLAIMS_ENABLED, false));
            return Optional.of(result);
        } catch (SecurityException ex) {
            log.warn("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.warn("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.warn("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.warn("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.warn("JWT claims string is empty.");
        }
        return Optional.empty();
    }

    protected Claims decodeToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    protected String createAccessToken(String sessionId, Instant iat, UserPrincipal userPrincipal) {
        Instant exp = iat.plus(authProperties.getTokenExpiration(), ChronoUnit.SECONDS);

        Map<String, Object> additionalClaims = new HashMap<>();
        additionalClaims.put(CLAIMS_TYPE, TOKEN_BEARER);
        additionalClaims.put(CLAIMS_SESSION, sessionId);
        additionalClaims.put(CLAIMS_USERNAME, userPrincipal.getUsername());
        additionalClaims.put(CLAIMS_NAME, userPrincipal.getName());
        additionalClaims.put(CLAIMS_SUPER_ADMIN, userPrincipal.getSuperAdmin());
        additionalClaims.put(CLAIMS_ENABLED, userPrincipal.isEnabled());

        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(userPrincipal.getId().toString())
                .setIssuedAt(Date.from(iat))
                .setExpiration(Date.from(exp))
                .addClaims(additionalClaims)
                .signWith(signKey)
                .compact();
    }

    protected String createRefreshToken(String sessionId, Instant iat, UserPrincipal userPrincipal) {
        Instant exp = iat.plus(authProperties.getRefreshExpiration(), ChronoUnit.SECONDS);

        Map<String, Object> additionalClaims = new HashMap<>();
        additionalClaims.put(CLAIMS_TYPE, TOKEN_BEARER);
        additionalClaims.put(CLAIMS_SESSION, sessionId);
        additionalClaims.put(CLAIMS_USERNAME, userPrincipal.getUsername());

        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(userPrincipal.getId().toString())
                .setIssuedAt(Date.from(iat))
                .setExpiration(Date.from(exp))
                .addClaims(additionalClaims)
                .signWith(signKey)
                .compact();
    }

    public Optional<Authentication> getAuthentication(String token) {
        return extractToken(token)
                .map(decodedToken -> {
                    UserPrincipal principal = UserPrincipal.builder()
                            .id(UUID.fromString(decodedToken.get(Claims.SUBJECT).toString()))
                            .username((String) decodedToken.getOrDefault(CLAIMS_USERNAME, null))
                            .name((String) decodedToken.getOrDefault(CLAIMS_NAME, null))
                            .superAdmin((Boolean) decodedToken.getOrDefault(CLAIMS_SUPER_ADMIN, false))
                            .enabled((boolean) decodedToken.getOrDefault(CLAIMS_ENABLED, false))
                            .build();

                    return new UsernamePasswordAuthenticationToken(principal, token, Set.of());
                });
    }
}