package com.ntd.unipassau.codeannotation.domain.dataset;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "snippet_question")
@DiscriminatorValue("snippet")
@Setter
@Getter
@ToString
public class SnippetQuestion extends Question {
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "snippet_id", nullable = false, foreignKey = @ForeignKey(name = "fk_squestion_snippet"))
    @ToString.Exclude
    private Snippet snippet;
}
