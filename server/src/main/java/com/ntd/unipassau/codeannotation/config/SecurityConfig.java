package com.ntd.unipassau.codeannotation.config;

import com.ntd.unipassau.codeannotation.security.RestAuthenticationEntryPoint;
import com.ntd.unipassau.codeannotation.security.jwt.JwtTokenFilter;
import com.ntd.unipassau.codeannotation.security.opaque.OpaqueTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig {
    private final UserDetailsService userDetailsService;
    private final JwtTokenFilter jwtTokenFilter;
    private final OpaqueTokenFilter opaqueTokenFilter;
    private final AppProperties.Auth authProperties;

    @Autowired
    public SecurityConfig(
            UserDetailsService userDetailsService,
            JwtTokenFilter jwtTokenFilter,
            OpaqueTokenFilter opaqueTokenFilter,
            AppProperties appProperties) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenFilter = jwtTokenFilter;
        this.opaqueTokenFilter = opaqueTokenFilter;
        this.authProperties = appProperties.getAuth();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .userDetailsService(userDetailsService)
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .exceptionHandling(customizer -> customizer.authenticationEntryPoint(new RestAuthenticationEntryPoint()))
                .authorizeHttpRequests(customizer -> {
                    customizer
                            .requestMatchers(
                                    "/",
                                    "/error",
                                    "/favicon.ico",
                                    "/api-docs/**",
                                    "/*/*.png",
                                    "/*/*.gif",
                                    "/*/*.svg",
                                    "/*/*.jpg",
                                    "/*/*.html",
                                    "/*/*.css",
                                    "/*/*.js"
                            ).permitAll()
                            .requestMatchers(HttpMethod.OPTIONS).permitAll()
                            .requestMatchers(authProperties.getPublicEndpoints()).permitAll()
                            .anyRequest().authenticated();

                });

        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterAfter(opaqueTokenFilter, JwtTokenFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
