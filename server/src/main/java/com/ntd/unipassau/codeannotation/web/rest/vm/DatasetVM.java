package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;
import java.util.Map;

@Data
public class DatasetVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    @JsonProperty("pLanguage")
    private String pLanguage;
    private String completeText;
    private Collection<@NotNull Long> demographicQuestionGroupIds;
    private Map<String, Map<String, Object>> configuration;
}
