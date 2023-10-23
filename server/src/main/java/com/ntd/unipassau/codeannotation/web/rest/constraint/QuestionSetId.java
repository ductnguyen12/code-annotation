package com.ntd.unipassau.codeannotation.web.rest.constraint;

import com.ntd.unipassau.codeannotation.web.rest.constraint.validator.QuestionSetIdValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = QuestionSetIdValidator.class)
@Target({ElementType.PARAMETER, ElementType.RECORD_COMPONENT, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface QuestionSetId {
    String message() default "Could not find question-set by id";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
