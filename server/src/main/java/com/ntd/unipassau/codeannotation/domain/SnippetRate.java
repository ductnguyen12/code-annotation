package com.ntd.unipassau.codeannotation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "snippet_rate")
@Setter
@Getter
@ToString
public class SnippetRate extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "snippet_rate_seq")
    @SequenceGenerator(name = "snippet_rate_seq", allocationSize = 1)
    private Long id;
    private String comment;
    private Integer value;
    @OneToOne(optional = false)
    @JoinColumn(name = "snippet_id", unique = true, nullable = false, updatable = false)
    private Snippet snippet;
}
