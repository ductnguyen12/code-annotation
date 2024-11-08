package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import com.ntd.unipassau.codeannotation.domain.rater.SolutionValue;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;

public class SolutionChoiceValidator extends SolutionValueValidator {
    protected SolutionChoiceValidator(ConstraintValidatorContext context) {
        super(context);
    }

    @Override
    boolean validate(int index, Question question, SolutionValue value) {
        checkMalformedSelectingQuestion(question);
        Collection<Integer> selected = Optional.ofNullable(value.getSelected())
                .orElse(Collections.emptyList())
                .stream()
                .filter(Objects::nonNull)
                .toList();
        return checkEmptyChoice(index, selected)
                && checkSingleChoiceQuestion(index, question, selected)
                && checkOutOfBoundChoice(index, selected, question.getAnswer().getOptions());
    }

    protected boolean checkSingleChoiceQuestion(int index, Question question, Collection<Integer> selected) {
        // Check if there are more than 1 selection for a single choice question
        if (QuestionType.SINGLE_CHOICE == question.getType() && selected.size() > 1) {
            context.buildConstraintViolationWithTemplate("Single choice question only accepts 1 answer")
                    .addPropertyNode(null).inIterable().atIndex(index)
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
