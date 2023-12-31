package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.question.QuestionSet;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "demographic_question_group")
@DiscriminatorValue("demographic")
@Setter
@Getter
@ToString
public class DemographicQuestionGroup extends QuestionSet {
    @ManyToMany
    @JoinTable(name = "dquestiongroup_dataset",
            joinColumns = @JoinColumn(name = "demographic_question_group_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "datasets_id", referencedColumnName = "id"))
    @ToString.Exclude
    private Set<Dataset> datasets;
}
