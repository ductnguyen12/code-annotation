package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.question.AnswerConstraint;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.rater.SolutionValue;
import jakarta.validation.ConstraintValidatorContext;

public class SolutionInputValidator extends SolutionValueValidator {
    protected SolutionInputValidator(ConstraintValidatorContext context) {
        super(context);
    }

    @Override
    boolean validate(int index, Question question, SolutionValue value) {
        AnswerConstraint constraint = question.getConstraint();
        if (value.getInput() == null) {
            context.buildConstraintViolationWithTemplate("'value.input' must not be null")
                    .addPropertyNode(null).inIterable().atIndex(index)
                    .addPropertyNode("value.input")
                    .addConstraintViolation();
            return false;
        }
        if (constraint == null)
            return true;
        if (Boolean.TRUE.equals(constraint.getIsNumber())
                && !Number.class.isAssignableFrom(value.getInput().getClass())) {
            context.buildConstraintViolationWithTemplate("'value.input' must be a number")
                    .addPropertyNode(null).inIterable().atIndex(index)
                    .addPropertyNode("value.input")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
