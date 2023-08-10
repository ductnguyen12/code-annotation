package com.ntd.unipassau.codeannotation.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

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
    @ToString.Exclude
    private Snippet snippet;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "rate")
    @ToString.Exclude
    private Set<RateAnswer> answers;

    @Transient
    private String rater;       // To overwrite the system generated lastModifiedBy value

    @PrePersist
    private void setLastModifiedByAsRater() {
        if (rater != null) {
            setLastModifiedBy(rater);
        }
    }
}
