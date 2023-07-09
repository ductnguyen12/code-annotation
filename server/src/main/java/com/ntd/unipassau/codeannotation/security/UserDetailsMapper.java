package com.ntd.unipassau.codeannotation.security;

import com.ntd.unipassau.codeannotation.domain.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserDetailsMapper {
    UserPrincipal toUserPrincipal(User user);
}
