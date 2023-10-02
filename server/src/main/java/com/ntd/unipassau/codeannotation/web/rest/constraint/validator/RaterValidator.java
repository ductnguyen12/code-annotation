package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestion;
import com.ntd.unipassau.codeannotation.repository.RQuestionRepository;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RaterConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.RSolutionVM;
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
    private final RQuestionRepository rQuestionRepository;

    @Autowired
    public RaterValidator(RQuestionRepository rQuestionRepository) {
        this.rQuestionRepository = rQuestionRepository;
    }

    @Override
    public boolean isValid(RaterVM rater, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        Collection<RSolutionVM> rSolutionVMs = rater.solutions();
        final List<RQuestion> allQuestions = rQuestionRepository.findAll();

        return checkRequiredQuestions(context, allQuestions, rSolutionVMs)
                && checkValidSolutionValues(context, allQuestions, rSolutionVMs);
    }

    protected boolean checkRequiredQuestions(
            ConstraintValidatorContext context,
            List<RQuestion> allQuestions,
            Collection<RSolutionVM> rSolutionVMs) {
        Set<Long> answeredQuestions = rSolutionVMs.stream()
                .map(RSolutionVM::questionId)
                .collect(Collectors.toSet());
        Set<Long> requiredNotAnsweredQuestions = allQuestions.stream()
                .filter(q -> null != q.getAnswerConstraint() && q.getAnswerConstraint().getRequired())
                .map(RQuestion::getId)
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
            List<RQuestion> allQuestions,
            Collection<RSolutionVM> rSolutionVMs) {
        return rSolutionVMs.stream()
                .allMatch(rSolutionVM -> {
                    Optional<RQuestion> optRQuestion = allQuestions.stream()
                            .filter(q -> q.getId().equals(rSolutionVM.questionId()))
                            .findFirst();
                    if (optRQuestion.isEmpty()) {
                        context.buildConstraintViolationWithTemplate("Unknown question ID: "
                                        + rSolutionVM.questionId())
                                .addConstraintViolation();
                        return false;
                    }

                    RQuestion rQuestion = optRQuestion.get();
                    RSolutionValueValidator validator = RSolutionValueValidator.createValidator(
                            context, rQuestion.getType());
                    return validator.validate(rQuestion, rSolutionVM.value());
                });
    }
}
