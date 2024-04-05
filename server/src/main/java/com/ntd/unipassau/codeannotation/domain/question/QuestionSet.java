package com.ntd.unipassau.codeannotation.domain.question;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "question_set")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype")
@Setter
@Getter
@ToString
public class QuestionSet extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_set_seq")
    @SequenceGenerator(name = "question_set_seq", allocationSize = 1)
    private Long id;
    private String title;
    @Column(length = 4096)
    private String description;
    private Integer priority;

    @OneToMany(
            mappedBy = "group",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @ToString.Exclude
    private Set<QuestionGroupAssignment> questionAssignments = new LinkedHashSet<>();

    public void addQuestion(Question question) {
        QuestionGroupAssignment assignment = new QuestionGroupAssignment(question, this);
        questionAssignments.add(assignment);
    }
}
