package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import com.ntd.unipassau.codeannotation.web.rest.constraint.QuestionConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.CollectionUtils;

import java.util.List;

public class QuestionValidator implements ConstraintValidator<QuestionConstraint, QuestionVM> {

    @Override
    public boolean isValid(QuestionVM rQuestionVM, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        if (List.of(
                QuestionType.SINGLE_CHOICE,
                QuestionType.MULTIPLE_CHOICE,
                QuestionType.RATING
        ).contains(rQuestionVM.getType())) {
            Answer answer = rQuestionVM.getAnswer();
            if (answer == null || CollectionUtils.isEmpty(answer.getOptions())) {
                context.buildConstraintViolationWithTemplate(
                                "Options must not be empty")
                        .addPropertyNode("answer.options")
                        .addConstraintViolation();
                return false;
            }
            if (QuestionType.RATING == rQuestionVM.getType() && CollectionUtils.isEmpty(answer.getAttributes())) {
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
