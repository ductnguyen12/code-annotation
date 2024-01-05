package com.ntd.unipassau.codeannotation.web.rest.vm;

import com.ntd.unipassau.codeannotation.web.rest.constraint.SolutionsConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class RaterVM {
    private UUID id;

    private String externalId;
    private String externalSystem;

    @NotNull
    @SolutionsConstraint
    private Collection<@NotNull SolutionVM> solutions;

    @NotNull
    private Long currentDatasetId;
}
