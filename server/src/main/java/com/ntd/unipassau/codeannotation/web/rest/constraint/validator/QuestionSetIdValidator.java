package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.repository.QuestionSetRepository;
import com.ntd.unipassau.codeannotation.web.rest.constraint.QuestionSetId;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class QuestionSetIdValidator implements ConstraintValidator<QuestionSetId, Long> {
    private final QuestionSetRepository questionSetRepository;

    @Autowired
    public QuestionSetIdValidator(QuestionSetRepository questionSetRepository) {
        this.questionSetRepository = questionSetRepository;
    }

    @Override
    public boolean isValid(Long questionSetId, ConstraintValidatorContext context) {
        return questionSetId == null || questionSetRepository.findById(questionSetId).isPresent();
    }
}
