package com.ntd.unipassau.codeannotation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "snippet")
@Setter
@Getter
@ToString
public class Snippet extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "snippet_seq")
    @SequenceGenerator(name = "snippet_seq", allocationSize = 1)
    private Long id;
    @Column(nullable = false)
    private String path;
    @Column(nullable = false)
    private Integer fromLine;
    @Column(nullable = false)
    private Integer toLine;
    @Column(name = "code", columnDefinition = "TEXT")
    @ToString.Exclude
    private String code;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dataset_id", nullable = false, updatable = false)
    @ToString.Exclude
    private Dataset dataset;

    @OneToMany(mappedBy = "snippet", cascade = CascadeType.ALL)
    @ToString.Exclude
    public Set<Question> questions;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "snippet")
    private SnippetRate rate;
}
