package com.ntd.unipassau.codeannotation.domain.question;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "question")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype")
@Setter
@Getter
@ToString
public class Question extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_seq")
    @SequenceGenerator(name = "question_seq", allocationSize = 1)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @Type(JsonType.class)
    @Column(name = "answer_constraint", columnDefinition = "jsonb")
    private AnswerConstraint constraint;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Answer answer;

    @Column(insertable = false, updatable = false)
    private String dtype;

    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @ToString.Exclude
    private Set<QuestionGroupAssignment> groupAssignments = new LinkedHashSet<>();

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "question")
    @ToString.Exclude
    private Set<Solution> solutions;
}
