package com.ntd.unipassau.codeannotation.domain.rquestion;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Collection;

@Entity
@Table(name = "rater_question_set")
@Setter
@Getter
@ToString
public class RQuestionSet extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rater_question_seq")
    @SequenceGenerator(name = "rater_question_seq", allocationSize = 1)
    private Long id;
    private String title;
    @Column(length = 4096)
    private String description;
    private Integer priority;

    @OneToMany(mappedBy = "questionSet")
    @ToString.Exclude
    private Collection<RQuestion> questions;
}
