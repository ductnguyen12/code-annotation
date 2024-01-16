package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import com.ntd.unipassau.codeannotation.repository.SnippetRepository;
import com.ntd.unipassau.codeannotation.web.rest.constraint.QuestionConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.DemographicQuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.QuestionVM;
import com.ntd.unipassau.codeannotation.web.rest.vm.SnippetVM;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;

import java.util.List;

public class QuestionValidator implements ConstraintValidator<QuestionConstraint, QuestionVM> {
    private final SnippetRepository snippetRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public QuestionValidator(
            SnippetRepository snippetRepository,
            ObjectMapper objectMapper) {
        this.snippetRepository = snippetRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean isValid(QuestionVM questionVM, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        try {
            validateChoiceQuestions(questionVM, context);
            validateDemographicSnippetQuestion(questionVM, context);
        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }

    void validateChoiceQuestions(QuestionVM questionVM, ConstraintValidatorContext context) {
        if (List.of(
                QuestionType.SINGLE_CHOICE,
                QuestionType.MULTIPLE_CHOICE,
                QuestionType.RATING
        ).contains(questionVM.getType())) {
            Answer answer = questionVM.getAnswer();
            if (answer == null || CollectionUtils.isEmpty(answer.getOptions())) {
                context.buildConstraintViolationWithTemplate(
                                "Options must not be empty")
                        .addPropertyNode("answer.options")
                        .addConstraintViolation();
                throw new IllegalArgumentException();
            }
            if (QuestionType.RATING == questionVM.getType() && CollectionUtils.isEmpty(answer.getAttributes())) {
                context.buildConstraintViolationWithTemplate(
                                "Attributes must not be empty")
                        .addPropertyNode("answer.attributes")
                        .addConstraintViolation();
                throw new IllegalArgumentException();
            }
        }
    }

    void validateDemographicSnippetQuestion(QuestionVM questionVM, ConstraintValidatorContext context) {
        if (questionVM.getType() == QuestionType.SNIPPET
                && questionVM instanceof DemographicQuestionVM demographicQuestionVM) {
            try {
                SnippetVM snippet = objectMapper.readValue(demographicQuestionVM.getContent(), SnippetVM.class);
                String errorMsg = null;

                if (snippet.getId() == null) {
                    errorMsg = "content.id (snippet id) is required if type == 'SNIPPET'";
                } else if (snippetRepository.findById(snippet.getId()).isEmpty()) {
                    errorMsg = "Could not find snippet by content.id=" + snippet.getId();
                }

                if (errorMsg != null) {
                    context.buildConstraintViolationWithTemplate(errorMsg)
                            .addPropertyNode("content")
                            .addConstraintViolation();
                    throw new IllegalArgumentException();
                }
            } catch (JsonProcessingException e) {
                context.buildConstraintViolationWithTemplate("Could not parse content as a snippet")
                        .addPropertyNode("content")
                        .addConstraintViolation();
                throw new IllegalArgumentException(e);
            }
        }
    }
}
