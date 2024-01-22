package com.ntd.unipassau.codeannotation.domain.prediction;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "model")
@Setter
@Getter
@ToString
public class Model extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "model_seq")
    @SequenceGenerator(name = "model_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private ModelExecutionType executionType;

    @Enumerated(EnumType.STRING)
    private OutputFormat outputFormat;

    @Column
    private Double ratingScale = 1d;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> config;

    @OneToMany(mappedBy = "model", orphanRemoval = true)
    @ToString.Exclude
    private Set<PredictedRating> predictedRatings;
}
