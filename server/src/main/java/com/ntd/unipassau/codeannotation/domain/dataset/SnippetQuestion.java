package com.ntd.unipassau.codeannotation.domain.dataset;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "snippet_question")
@Setter
@Getter
@ToString
public class SnippetQuestion extends Question {
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "snippet_id", nullable = false, foreignKey = @ForeignKey(name = "fk_squestion_snippet"))
    @ToString.Exclude
    private Snippet snippet;

    public Solution getSolution() {
        Set<Solution> solutions = getSolutions();
        if (solutions == null || solutions.isEmpty())
            return null;
        return solutions.iterator().next();
    }
}
