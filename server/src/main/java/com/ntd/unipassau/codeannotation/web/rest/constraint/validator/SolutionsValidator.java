package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.web.rest.constraint.SolutionsConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;

public class SolutionsValidator implements ConstraintValidator<SolutionsConstraint, Collection<SolutionVM>> {
    @Override
    public boolean isValid(Collection<SolutionVM> solutions, ConstraintValidatorContext context) {
        return true;
    }
}
