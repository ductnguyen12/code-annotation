package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "snippet_rate",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"snippet_id", "rater_id"})})
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
    @ManyToOne(optional = false)
    @JoinColumn(name = "snippet_id", nullable = false, foreignKey = @ForeignKey(name = "fk_rate_snippet"))
    @ToString.Exclude
    private Snippet snippet;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rater_id", nullable = false, foreignKey = @ForeignKey(name = "fk_rate_rater"))
    @ToString.Exclude
    private Rater rater;
}
