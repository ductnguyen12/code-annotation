package com.ntd.unipassau.codeannotation.security;

import com.ntd.unipassau.codeannotation.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserDetailsMapper {
    @Mapping(target = "authorities", ignore = true)
    UserPrincipal toUserPrincipal(User user);
}
