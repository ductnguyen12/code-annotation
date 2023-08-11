package com.ntd.unipassau.codeannotation.security;

import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class UserPrincipal implements UserDetails {
    private UUID id;
    private String username;
    private String password;
    private String name;
    private boolean enabled;
    private Boolean superAdmin;
    private UUID raterId;
    private Collection<String> authorities;

    public void addAuthorities(Collection<String> authorities) {
        if (this.authorities == null) {
            this.authorities = new LinkedHashSet<>();
        }
        this.authorities.addAll(authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
