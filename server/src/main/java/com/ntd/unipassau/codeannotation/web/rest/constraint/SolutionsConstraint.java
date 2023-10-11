package com.ntd.unipassau.codeannotation.web.rest.constraint;

import com.ntd.unipassau.codeannotation.web.rest.constraint.validator.SolutionsValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = SolutionsValidator.class)
@Target({ElementType.PARAMETER, ElementType.RECORD_COMPONENT, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface SolutionsConstraint {
    String message() default "Solutions is not valid";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
