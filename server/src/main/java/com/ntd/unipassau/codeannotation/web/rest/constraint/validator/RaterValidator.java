package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.rater.RaterQuestion;
import com.ntd.unipassau.codeannotation.repository.RaterQuestionRepository;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RaterConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.RaterVM;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RaterValidator implements ConstraintValidator<RaterConstraint, RaterVM> {
    private final RaterQuestionRepository rQuestionRepository;

    @Autowired
    public RaterValidator(RaterQuestionRepository rQuestionRepository) {
        this.rQuestionRepository = rQuestionRepository;
    }

    @Override
    public boolean isValid(RaterVM rater, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        Collection<SolutionVM> rSolutionVMs = rater.solutions();
        final List<RaterQuestion> allQuestions = rQuestionRepository.findAll();

        return checkRequiredQuestions(context, allQuestions, rSolutionVMs)
                && checkValidSolutionValues(context, allQuestions, rSolutionVMs);
    }

    protected boolean checkRequiredQuestions(
            ConstraintValidatorContext context,
            List<RaterQuestion> allQuestions,
            Collection<SolutionVM> rSolutionVMs) {
        Set<Long> answeredQuestions = rSolutionVMs.stream()
                .map(SolutionVM::questionId)
                .collect(Collectors.toSet());
        Set<Long> requiredNotAnsweredQuestions = allQuestions.stream()
                .filter(q -> null != q.getConstraint() && q.getConstraint().getRequired())
                .map(RaterQuestion::getId)
                .filter(id -> !answeredQuestions.contains(id))
                .collect(Collectors.toSet());

        if (requiredNotAnsweredQuestions.size() > 0) {
            context.buildConstraintViolationWithTemplate("The following questions are required: "
                            + requiredNotAnsweredQuestions.stream()
                            .map(id -> id + "")
                            .collect(Collectors.joining(",")))
                    .addConstraintViolation();
            return false;
        }

        return true;
    }

    protected boolean checkValidSolutionValues(
            ConstraintValidatorContext context,
            List<RaterQuestion> allQuestions,
            Collection<SolutionVM> rSolutionVMs) {
        return rSolutionVMs.stream()
                .allMatch(rSolutionVM -> {
                    Optional<RaterQuestion> optRQuestion = allQuestions.stream()
                            .filter(q -> q.getId().equals(rSolutionVM.questionId()))
                            .findFirst();
                    if (optRQuestion.isEmpty()) {
                        context.buildConstraintViolationWithTemplate("Unknown question ID: "
                                        + rSolutionVM.questionId())
                                .addConstraintViolation();
                        return false;
                    }

                    RaterQuestion rQuestion = optRQuestion.get();
                    SolutionValueValidator validator = SolutionValueValidator.createValidator(
                            context, rQuestion.getType());
                    return validator.validate(rQuestion, rSolutionVM.value());
                });
    }
}
