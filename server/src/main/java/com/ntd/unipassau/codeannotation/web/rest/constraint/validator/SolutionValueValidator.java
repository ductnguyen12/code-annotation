package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.question.QuestionType;
import com.ntd.unipassau.codeannotation.domain.rater.SolutionValue;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public abstract class SolutionValueValidator {
    protected final ConstraintValidatorContext context;

    protected SolutionValueValidator(ConstraintValidatorContext context) {
        this.context = context;
    }

    public static SolutionValueValidator createValidator(
            ConstraintValidatorContext context, QuestionType questionType) {
        return switch (questionType) {
            case SINGLE_CHOICE, MULTIPLE_CHOICE -> new SolutionChoiceValidator(context);
            case RATING -> new SolutionRatingValidator(context);
            case INPUT -> new SolutionInputValidator(context);
            case NON_QUESTION -> new SolutionValueValidator(context) {
                @Override
                boolean validate(int index, Question question, SolutionValue value) {
                    return true;
                }
            };
        };
    }

    abstract boolean validate(int index, Question question, SolutionValue value);

    protected void checkMalformedSelectingQuestion(Question question) {
        // Malformed question was created in the past
        Answer answer = question.getAnswer();
        if (answer == null || answer.getOptions() == null || answer.getOptions().isEmpty()) {
            throw new RuntimeException("Question ID " + question.getId() + " does not have any option to select");
        }
    }

    protected boolean checkOutOfBoundChoice(int index, Collection<Integer> selected, List<String> options) {
        // Check if there is any weird selection
        Optional<Integer> outOfBoundIndex = selected.stream().filter(i -> i >= options.size()).findFirst();
        if (outOfBoundIndex.isPresent()) {
            context.buildConstraintViolationWithTemplate(
                            "Selected option is out of bound: "
                                    + outOfBoundIndex.get() + "/" + (options.size() - 1))
                    .addPropertyNode(null).inIterable().atIndex(index)
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }

    protected boolean checkEmptyChoice(int index, Collection<Integer> selected) {
        // Check empty selection
        if (selected.isEmpty()) {
            context.buildConstraintViolationWithTemplate("'value.selected' must not be empty")
                    .addPropertyNode(null).inIterable().atIndex(index)
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
