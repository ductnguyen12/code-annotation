package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.rquestion.RAnswer;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestion;
import com.ntd.unipassau.codeannotation.domain.rquestion.RQuestionType;
import com.ntd.unipassau.codeannotation.domain.rquestion.RSolutionValue;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public abstract class RSolutionValueValidator {
    protected final ConstraintValidatorContext context;

    protected RSolutionValueValidator(ConstraintValidatorContext context) {
        this.context = context;
    }

    public static RSolutionValueValidator createValidator(
            ConstraintValidatorContext context, RQuestionType questionType) {
        return switch (questionType) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE -> new RSolutionChoiceValidator(context);
            case RATING -> new RSolutionRatingValidator(context);
            case INPUT -> new RSolutionInputValidator(context);
            case NON_QUESTION -> new RSolutionValueValidator(context) {
                @Override
                boolean validate(RQuestion question, RSolutionValue value) {
                    return true;
                }
            };
        };
    }

    abstract boolean validate(RQuestion question, RSolutionValue value);

    protected void checkMalformedSelectingQuestion(RQuestion question) {
        // Malformed question was created in the past
        RAnswer answer = question.getAnswer();
        if (answer == null || answer.getOptions() == null || answer.getOptions().isEmpty()) {
            throw new RuntimeException("Question ID " + question.getId() + " does not have any option to select");
        }
    }

    protected boolean checkOutOfBoundChoice(Collection<Integer> selected, List<String> options) {
        // Check if there is any weird selection
        Optional<Integer> outOfBoundIndex = selected.stream().filter(index -> index >= options.size()).findFirst();
        if (outOfBoundIndex.isPresent()) {
            context.buildConstraintViolationWithTemplate(
                            "Selected option is out of bound: "
                                    + outOfBoundIndex.get() + "/" + (options.size() - 1))
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }

    protected boolean checkEmptyChoice(Collection<Integer> selected) {
        // Check empty selection
        if (selected.isEmpty()) {
            context.buildConstraintViolationWithTemplate("'value.selected' must not be empty")
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
