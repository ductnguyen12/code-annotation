package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.rquestion.RAnswerConstraint;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestion;
import com.ntd.unipassau.codeannotation.domain.rquestion.RSolutionValue;
import jakarta.validation.ConstraintValidatorContext;

public class RSolutionInputValidator extends RSolutionValueValidator {
    protected RSolutionInputValidator(ConstraintValidatorContext context) {
        super(context);
    }

    @Override
    boolean validate(RQuestion question, RSolutionValue value) {
        RAnswerConstraint constraint = question.getAnswerConstraint();
        if (value.getInput() == null) {
            context.buildConstraintViolationWithTemplate("'value.input' must not be null")
                    .addPropertyNode("value.input")
                    .addConstraintViolation();
            return false;
        }
        if (constraint == null)
            return true;
        if (Boolean.TRUE.equals(constraint.getIsNumber())
                && !Number.class.isAssignableFrom(value.getInput().getClass())) {
            context.buildConstraintViolationWithTemplate("'value.input' must be a number")
                    .addPropertyNode("value.input")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
