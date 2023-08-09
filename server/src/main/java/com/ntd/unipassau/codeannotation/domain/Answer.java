package com.ntd.unipassau.codeannotation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "answer")
@Setter
@Getter
@ToString
public class Answer extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "answer_seq")
    @SequenceGenerator(name = "answer_seq", allocationSize = 1)
    private Long id;
    private String content;
    private Boolean rightAnswer = false;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @ToString.Exclude
    private Question question;

    @OneToOne(cascade = CascadeType.REMOVE, mappedBy = "answer")
    @ToString.Exclude
    private RateAnswer rateAnswer;

    public boolean isSelected() {
        return rateAnswer != null;
    }
}
