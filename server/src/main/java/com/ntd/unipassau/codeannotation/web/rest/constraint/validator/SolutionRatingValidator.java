package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.question.Answer;
import com.ntd.unipassau.codeannotation.domain.rater.RaterQuestion;
import com.ntd.unipassau.codeannotation.domain.rater.SolutionValue;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

public class SolutionRatingValidator extends SolutionValueValidator {
    protected SolutionRatingValidator(ConstraintValidatorContext context) {
        super(context);
    }

    @Override
    boolean validate(RaterQuestion question, SolutionValue value) {
        checkMalformedSelectingQuestion(question);
        Collection<Integer> selected = value.getSelected().stream().filter(Objects::nonNull).toList();
        return checkEmptyChoice(selected)
                && checkOutOfBoundChoice(selected, question.getAnswer().getOptions())
                && checkAllAttributesAreRated(selected, question.getAnswer().getAttributes());
    }

    protected void checkMalformedSelectingQuestion(RaterQuestion question) {
        super.checkMalformedSelectingQuestion(question);
        Answer answer = question.getAnswer();
        if (answer.getAttributes() == null || answer.getAttributes().isEmpty()) {
            throw new RuntimeException("Question ID " + question.getId() + " does not have any attribute to rate");
        }
    }

    protected boolean checkAllAttributesAreRated(Collection<Integer> selected, List<String> attributes) {
        // Check if all attributes are rated
        if (selected.size() != attributes.size()) {
            context.buildConstraintViolationWithTemplate(
                            "Rating question requires all attributes to be rated but only "
                                    + selected.size() + "/" + attributes.size() + " attributes have been rated")
                    .addPropertyNode("value.selected")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}