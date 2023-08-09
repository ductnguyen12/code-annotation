package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.Answer;
import com.ntd.unipassau.codeannotation.domain.Question;
import com.ntd.unipassau.codeannotation.domain.Snippet;
import com.ntd.unipassau.codeannotation.export.model.AnswerDoc;
import com.ntd.unipassau.codeannotation.export.model.QuestionDoc;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExportModelMapper {
    @Mapping(target = "comment", source = "rate.comment")
    @Mapping(target = "rate", source = "rate.value")
    @Mapping(target = "rater", source = "rate.lastModifiedBy")
    SnippetDoc toSnippetDoc(Snippet snippet);
    QuestionDoc toQuestionDoc(Question question);
    AnswerDoc toAnswerDoc(Answer answer);
}
