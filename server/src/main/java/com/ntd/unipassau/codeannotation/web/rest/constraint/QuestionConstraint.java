package com.ntd.unipassau.codeannotation.web.rest.constraint;

import com.ntd.unipassau.codeannotation.web.rest.constraint.validator.QuestionValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = QuestionValidator.class)
@Target({ElementType.PARAMETER, ElementType.RECORD_COMPONENT, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface QuestionConstraint {
    String message() default "RQuestion is not valid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
