package com.ntd.unipassau.codeannotation.web.rest.constraint.validator;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.repository.QuestionRepository;
import com.ntd.unipassau.codeannotation.web.rest.constraint.SolutionsConstraint;
import com.ntd.unipassau.codeannotation.web.rest.vm.SolutionVM;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class SolutionsValidator implements ConstraintValidator<SolutionsConstraint, Collection<SolutionVM>> {
    private final QuestionRepository questionRepository;

    @Autowired
    public SolutionsValidator(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public boolean isValid(Collection<SolutionVM> solutions, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        List<Long> questionIds = solutions.stream().map(SolutionVM::questionId).toList();
        List<Question> questions = questionRepository.findAllById(questionIds);
        return checkValidSolutionValues(context, questions, solutions);
    }

    protected boolean checkValidSolutionValues(
            ConstraintValidatorContext context,
            Collection<Question> questions,
            Collection<SolutionVM> solutions) {
        final AtomicInteger counter = new AtomicInteger(0);
        return solutions.stream()
                .allMatch(solution -> {
                    int index = counter.getAndAdd(1);
                    Optional<Question> optQuestion = questions.stream()
                            .filter(q -> q.getId().equals(solution.questionId()))
                            .findFirst();
                    if (optQuestion.isEmpty()) {
                        context.buildConstraintViolationWithTemplate("Unknown question ID: "
                                        + solution.questionId())
                                .addPropertyNode(null)
                                .inIterable().atIndex(index)
                                .addPropertyNode("questionId")
                                .addConstraintViolation();
                        return false;
                    }
                    Question question = optQuestion.get();
                    SolutionValueValidator validator = SolutionValueValidator.createValidator(
                            context, question.getType());
                    return validator.validate(index, question, solution.value());
                });
    }
}
