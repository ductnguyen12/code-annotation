package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DatasetVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
}
