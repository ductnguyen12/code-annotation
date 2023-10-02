package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestion;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionType;
import com.ntd.unipassau.codeannotation.domain.rquestion.RSolutionValue;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;
import java.util.Objects;

public class RSolutionChoiceValidator extends RSolutionValueValidator {
    protected RSolutionChoiceValidator(ConstraintValidatorContext context) {
        super(context);
    }

    @Override
    boolean validate(RQuestion question, RSolutionValue value) {
        checkMalformedSelectingQuestion(question);
        Collection<Integer> selected = value.getSelected().stream().filter(Objects::nonNull).toList();
        return checkEmptyChoice(selected)
                && checkSingleChoiceQuestion(question, selected)
                && checkOutOfBoundChoice(selected, question.getAnswer().getOptions());
    }

    protected boolean checkSingleChoiceQuestion(RQuestion question, Collection<Integer> selected) {
        // Check if there are more than 1 selection for a single choice question
        if (RQuestionType.SINGLE_CHOICE == question.getType() && selected.size() > 1) {
            context.buildConstraintViolationWithTemplate("Single choice question only accepts 1 answer")
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
