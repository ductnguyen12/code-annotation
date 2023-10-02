package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.rquestion.RAnswer;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionType;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RQuestionConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.RQuestionVM;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.CollectionUtils;

import java.util.List;

public class RQuestionValidator implements ConstraintValidator<RQuestionConstraint, RQuestionVM> {

    @Override
    public boolean isValid(RQuestionVM rQuestionVM, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        if (List.of(
                RQuestionType.SINGLE_CHOICE,
                RQuestionType.MULTIPLE_CHOICE,
                RQuestionType.RATING
        ).contains(rQuestionVM.type())) {
            RAnswer answer = rQuestionVM.answer();
            if (answer == null || CollectionUtils.isEmpty(answer.getOptions())) {
                context.buildConstraintViolationWithTemplate(
                                "Options must not be empty")
                        .addPropertyNode("answer.options")
                        .addConstraintViolation();
                return false;
            }
            if (RQuestionType.RATING == rQuestionVM.type() && CollectionUtils.isEmpty(answer.getAttributes())) {
                context.buildConstraintViolationWithTemplate(
                                "Attributes must not be empty")
                        .addPropertyNode("answer.attributes")
                        .addConstraintViolation();
                return false;
            }
        }

        return true;
    }
}
