package com.ntd.unipassau.codeannotation.domain.dataset;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.AttentionCheck;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictedRating;
import com.ntd.unipassau.codeannotation.domain.rater.SnippetRate;
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
public class Snippet extends AbstractAuditingEntity<Long> implements AttentionCheck {
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

    @Column(name = "correct_rating")
    private Integer correctRating;      // for attention check

    private Integer priority;

    @Column(name = "dataset_id", insertable = false, updatable = false)
    private Long datasetId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dataset_id", nullable = false, updatable = false,
            foreignKey = @ForeignKey(name = "fk_snippet_dataset"))
    @ToString.Exclude
    private Dataset dataset;

    @OneToMany(mappedBy = "snippet", cascade = CascadeType.ALL)
    @ToString.Exclude
    public Set<SnippetQuestion> questions;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "snippet")
    @ToString.Exclude
    private Set<SnippetRate> rates;

    @OneToMany(
            mappedBy = "snippet",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @ToString.Exclude
    private Set<PredictedRating> predictedRatings;

    @Override
    public boolean isAttentionCheck() {
        return correctRating != null;
    }
}
