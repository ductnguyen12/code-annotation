package com.ntd.unipassau.codeannotation.domain.prediction;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.io.Serializable;
import java.util.Map;

@Entity
@Table(name = "predicted_rating")
@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictedRating extends AbstractAuditingEntity<PredictedRating.PRatingId> {
    @EmbeddedId
    private PRatingId id;

    @Column(nullable = false)
    private Double value;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Double> metrics;

    @MapsId("snippetId")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "snippet_id", nullable = false, foreignKey = @ForeignKey(name = "fk_prating_snippet"))
    @ToString.Exclude
    private Snippet snippet;

    @MapsId("modelId")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false, foreignKey = @ForeignKey(name = "fk_prating_model"))
    @ToString.Exclude
    private Model model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "execution_id", foreignKey = @ForeignKey(name = "fk_prating_execution"))
    @ToString.Exclude
    private ModelExecution execution;

    @Embeddable
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PRatingId implements Serializable {
        private Long snippetId;
        private Long modelId;
    }
}
