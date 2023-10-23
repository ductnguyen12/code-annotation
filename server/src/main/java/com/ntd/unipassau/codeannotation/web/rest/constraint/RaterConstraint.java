package com.ntd.unipassau.codeannotation.web.rest.constraint;

import com.ntd.unipassau.codeannotation.web.rest.constraint.validator.RaterValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RaterValidator.class)
@Target({ElementType.PARAMETER, ElementType.RECORD_COMPONENT, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RaterConstraint {
    String message() default "Rater info is not valid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
