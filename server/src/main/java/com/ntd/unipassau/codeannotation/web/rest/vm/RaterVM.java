package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class RaterVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    @NotNull
    @Min(value = 0,message = "yearOfExp must be a natural number")
    private Integer yearOfExp;
}
