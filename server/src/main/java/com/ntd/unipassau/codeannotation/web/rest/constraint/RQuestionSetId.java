package com.ntd.unipassau.codeannotation.web.rest.constraint;

import com.ntd.unipassau.codeannotation.web.rest.constraint.validator.RQuestionSetIdValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RQuestionSetIdValidator.class)
@Target({ElementType.PARAMETER, ElementType.RECORD_COMPONENT, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RQuestionSetId {
    String message() default "Could not find rater-question-set by id";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
