package com.ntd.unipassau.codeannotation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Collection;

@Entity
@Table(name = "question")
@Setter
@Getter
@ToString
public class Question extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "question_seq")
    @SequenceGenerator(name = "question_seq", allocationSize = 1)
    private Long id;
    private String content;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @ToString.Exclude
    private Collection<Answer> answers;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "snippet_id", nullable = false)
    @ToString.Exclude
    public Snippet snippet;
}
