package com.ntd.unipassau.codeannotation.export.model;

import lombok.Builder;
import lombok.Data;

import java.util.Collection;

@Data
@Builder
public class SnippetDoc {
    private String path;
    private Integer fromLine;
    private Integer toLine;
    private String comment;
    private Integer rate;
    private String rater;
    private Collection<QuestionDoc> questions;
}
