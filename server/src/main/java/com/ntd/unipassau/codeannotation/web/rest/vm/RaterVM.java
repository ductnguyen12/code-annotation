package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class RaterVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    @NotNull(message = "Year of experience is required")
    @Min(value = 0,message = "Year of experience must be a natural number")
    private Integer yearOfExp;
}
