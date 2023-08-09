package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;

@Data
public class SnippetVM {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @NotBlank
    private String path;
    @Min(1)
    private Integer fromLine;
    @Min(1)
    private Integer toLine;
    @NotNull
    private Long datasetId;
    private Collection<@NotNull QuestionVM> questions;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String code;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private SnippetRateVM rate;
}
