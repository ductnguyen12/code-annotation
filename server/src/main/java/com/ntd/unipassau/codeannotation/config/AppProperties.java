package com.ntd.unipassau.codeannotation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private Auth auth = new Auth();

    @Data
    public static final class Auth {
        private String tokenSecret;
        private long tokenExpiration;
        private long refreshExpiration;
        public String[] publicEndpoints;
        private RootUser rootUser;
    }

    @Data
    public static final class RootUser {
        private String username;
        private String password;
    }
}
