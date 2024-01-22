package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.question.Question;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "demographic_question")
@DiscriminatorValue("demographic")
@Setter
@Getter
@ToString
public class DemographicQuestion extends Question {
    @Column(name = "parent_question_id", insertable = false, updatable = false)
    private Long parentQuestionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private DemographicQuestion parentQuestion;

    @OneToMany(mappedBy = "parentQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<DemographicQuestion> subQuestions = new LinkedHashSet<>();

    public void addSubQuestion(DemographicQuestion question) {
        if (this.subQuestions == null)
            this.subQuestions = new LinkedHashSet<>();
        this.subQuestions.add(question);
        question.setParentQuestion(this);
    }

    public void removeSubQuestion(DemographicQuestion question) {
        if (this.subQuestions == null)
            return;
        this.subQuestions.remove(question);
        question.setParentQuestion(null);
    }
}
