package com.ntd.unipassau.codeannotation.web.rest.vm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class Login {
    @NotBlank(message = "Username is required")
    private String username;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)\\S{8,}$",
            message = "Password must have 8 characters minimum " +
                    "including at least one uppercase, one lowercase letter and one number")
    @NotBlank(message = "Password is required")
    private String password;
}
