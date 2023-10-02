package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.repository.RQuestionSetRepository;
import com.ntd.unipassau.codeannotation.web.rest.constraint.RQuestionSetId;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class RQuestionSetIdValidator implements ConstraintValidator<RQuestionSetId, Long> {
    private final RQuestionSetRepository rQuestionSetRepository;

    @Autowired
    public RQuestionSetIdValidator(RQuestionSetRepository rQuestionSetRepository) {
        this.rQuestionSetRepository = rQuestionSetRepository;
    }

    @Override
    public boolean isValid(Long questionSetId, ConstraintValidatorContext context) {
        return questionSetId == null || rQuestionSetRepository.findById(questionSetId).isPresent();
    }
}
