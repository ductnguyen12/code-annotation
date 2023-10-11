package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.rater.RaterQuestion;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import com.ntd.unipassau.codeannotation.domain.rater.SolutionValue;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;
import java.util.Objects;

public class SolutionChoiceValidator extends SolutionValueValidator {
    protected SolutionChoiceValidator(ConstraintValidatorContext context) {
        super(context);
    }

    @Override
    boolean validate(RaterQuestion question, SolutionValue value) {
        checkMalformedSelectingQuestion(question);
        Collection<Integer> selected = value.getSelected().stream().filter(Objects::nonNull).toList();
        return checkEmptyChoice(selected)
                && checkSingleChoiceQuestion(question, selected)
                && checkOutOfBoundChoice(selected, question.getAnswer().getOptions());
    }

    protected boolean checkSingleChoiceQuestion(RaterQuestion question, Collection<Integer> selected) {
        // Check if there are more than 1 selection for a single choice question
        if (QuestionType.SINGLE_CHOICE == question.getType() && selected.size() > 1) {
            context.buildConstraintViolationWithTemplate("Single choice question only accepts 1 answer")
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
