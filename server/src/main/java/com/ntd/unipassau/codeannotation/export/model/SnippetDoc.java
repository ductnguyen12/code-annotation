package com.ntd.unipassau.codeannotation.export.model;

import lombok.Data;

import java.util.Collection;

@Data
public class SnippetDoc {
    private String path;
    private Integer fromLine;
    private Integer toLine;
    private Collection<QuestionDoc> questions;
    private Collection<RateDoc> rates;
}
