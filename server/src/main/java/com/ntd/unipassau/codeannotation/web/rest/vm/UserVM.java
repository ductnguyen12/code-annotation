package com.ntd.unipassau.codeannotation.web.rest.vm;

import lombok.Data;

import java.util.UUID;

@Data
public class UserVM {
    private UUID id;
    private String username;
    private String name;
    private boolean enabled;
    private Boolean superAdmin;
    private UUID raterId;
}
