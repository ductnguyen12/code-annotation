package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.util.CollectionUtils;

import java.util.Collection;

@Data
public class SnippetVM {
    private Long id;
    @NotBlank(message = "Path is required")
    private String path;
    @Min(1)
    private Integer fromLine;
    @Min(1)
    private Integer toLine;
    @NotNull(message = "Dataset ID is required")
    private Long datasetId;
    private Collection<@NotNull(message = "A question can not be null") SnippetQuestionVM> questions;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String code;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Collection<SnippetRateVM> rates;

    public SnippetRateVM getRate() {
        if (CollectionUtils.isEmpty(rates))
            return null;
        return rates.iterator().next();
    }
}
