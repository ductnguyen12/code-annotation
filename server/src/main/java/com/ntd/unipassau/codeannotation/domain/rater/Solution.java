package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.question.Question;
import io.hypersistence.utils.hibernate.type.interval.PostgreSQLIntervalType;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.io.Serializable;
import java.time.Duration;
import java.util.UUID;

@Entity
@Table(name = "solution")
@Setter
@Getter
@ToString
public class Solution extends AbstractAuditingEntity<Solution.SolutionId> {
    @EmbeddedId
    private SolutionId id;

    @MapsId("questionId")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Question question;

    @MapsId("raterId")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Rater rater;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private SolutionValue solution;

    @Type(PostgreSQLIntervalType.class)
    @Column(
            name = "time_taken",
            columnDefinition = "interval"
    )
    private Duration timeTaken;

    @Embeddable
    @Data
    @EqualsAndHashCode
    public static class SolutionId implements Serializable {
        private Long questionId;
        private UUID raterId;
    }

    public UUID getRaterId() {
        if (id == null)
            return null;
        return id.raterId;
    }
}
