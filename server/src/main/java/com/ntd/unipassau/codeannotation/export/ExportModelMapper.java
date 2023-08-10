package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.Answer;
import com.ntd.unipassau.codeannotation.domain.Question;
import com.ntd.unipassau.codeannotation.domain.RateAnswer;
import com.ntd.unipassau.codeannotation.domain.Snippet;
import com.ntd.unipassau.codeannotation.export.model.AnswerDoc;
import com.ntd.unipassau.codeannotation.export.model.QuestionDoc;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.LinkedHashSet;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface ExportModelMapper {
    @Mapping(target = "comment", source = "rate.comment")
    @Mapping(target = "rate", source = "rate.value")
    @Mapping(target = "rater", source = "rate.lastModifiedBy")
    SnippetDoc toSnippetDoc(Snippet snippet);

    QuestionDoc toQuestionDoc(Question question);

    AnswerDoc toAnswerDoc(Answer answer);

    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataset", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "code", ignore = true)
    @Mapping(target = "rate.comment", source = "comment")
    @Mapping(target = "rate.value", source = "rate")
    @Mapping(target = "rate.createdBy", source = "rater")
    @Mapping(target = "rate.lastModifiedBy", source = "rater")
    @Mapping(target = "rate.rater", source = "rater")
    Snippet toSnippet(SnippetDoc snippet);

    @Mapping(target = "snippet", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Question toQuestion(QuestionDoc question);

    @Mapping(target = "rateAnswer", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    Answer toAnswer(AnswerDoc answer);

    @AfterMapping
    default void afterToSnippet(@MappingTarget Snippet snippet) {
        Set<RateAnswer> rateAnswers = new LinkedHashSet<>();
        // Ensure bi-directional relation
        snippet.getQuestions().forEach(q -> {
            q.setSnippet(snippet);
            q.getAnswers().forEach(a -> {
                a.setQuestion(q);
                if (a.isSelected()) {
                    RateAnswer rateAnswer = a.getRateAnswer();
                    rateAnswer.setRate(snippet.getRate());
                    rateAnswers.add(rateAnswer);
                }
            });
        });
        if (snippet.getRate() != null) {
            snippet.getRate().setSnippet(snippet);
            snippet.getRate().setAnswers(rateAnswers);
        }
    }

    @AfterMapping
    default void afterToAnswer(AnswerDoc answerDoc, @MappingTarget Answer answer) {
        if (answerDoc.isSelected()) {
            RateAnswer rateAnswer = new RateAnswer();
            rateAnswer.setAnswer(answer);
            answer.setRateAnswer(rateAnswer);
        }
    }
}
