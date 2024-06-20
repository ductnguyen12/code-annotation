package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.rater.DemographicQuestion;
import com.ntd.unipassau.codeannotation.repository.DatasetRepository;
import com.ntd.unipassau.codeannotation.repository.DemographicQuestionRepository;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RaterConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import io.jsonwebtoken.lang.Collections;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RaterValidator implements ConstraintValidator<RaterConstraint, RaterVM> {
    private final DemographicQuestionRepository demographicQuestionRepository;
    private final DatasetRepository datasetRepository;

    @Autowired
    public RaterValidator(
            DemographicQuestionRepository demographicQuestionRepository,
            DatasetRepository datasetRepository) {
        this.demographicQuestionRepository = demographicQuestionRepository;
        this.datasetRepository = datasetRepository;
    }

    @Override
    public boolean isValid(RaterVM rater, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        Collection<SolutionVM> rSolutionVMs = rater.getSolutions();
        Optional<Dataset> optDataset = datasetRepository.findById(rater.getCurrentDatasetId());
        if (optDataset.isEmpty()) {
            context.buildConstraintViolationWithTemplate(
                            "currentDatasetId does not exist: " + rater.getCurrentDatasetId())
                    .addPropertyNode("currentDatasetId")
                    .addConstraintViolation();
            return false;
        } else if (optDataset.get().isArchived()) {
            context.buildConstraintViolationWithTemplate(
                            "Could not register to an archived dataset: " + rater.getCurrentDatasetId())
                    .addPropertyNode("currentDatasetId")
                    .addConstraintViolation();
            return false;
        }
        final Collection<DemographicQuestion> allQuestions = demographicQuestionRepository
                .findAllFetchGroup(rater.getCurrentDatasetId()).stream()
                // unfold the first-level sub-questions
                .flatMap(dq -> {
                    if (Collections.isEmpty(dq.getSubQuestions()))
                        return Set.of(dq).stream();
                    Collection<DemographicQuestion> questions = new LinkedHashSet<>();
                    questions.add(dq);
                    questions.addAll(dq.getSubQuestions());
                    return questions.stream();
                })
                .collect(Collectors.toSet());
        return checkRequiredQuestions(context, allQuestions, rSolutionVMs);
    }

    protected boolean checkRequiredQuestions(
            ConstraintValidatorContext context,
            Collection<DemographicQuestion> allQuestions,
            Collection<SolutionVM> rSolutionVMs) {
        Set<Long> answeredQuestions = rSolutionVMs.stream()
                .map(SolutionVM::questionId)
                .collect(Collectors.toSet());
        Set<Long> requiredNotAnsweredQuestions = allQuestions.stream()
                .filter(q -> null != q.getConstraint() && Boolean.TRUE.equals(q.getConstraint().getRequired()))
                .map(DemographicQuestion::getId)
                .filter(id -> !answeredQuestions.contains(id))
                .collect(Collectors.toSet());

        if (!requiredNotAnsweredQuestions.isEmpty()) {
            context.buildConstraintViolationWithTemplate("The following questions are required: "
                            + requiredNotAnsweredQuestions.stream()
                            .map(id -> id + "")
                            .collect(Collectors.joining(",")))
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
