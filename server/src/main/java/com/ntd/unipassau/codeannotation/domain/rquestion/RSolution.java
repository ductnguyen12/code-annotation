package com.ntd.unipassau.codeannotation.domain.rquestion;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.Rater;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "rater_question_solution")
@Setter
@Getter
@ToString
public class RSolution extends AbstractAuditingEntity<RSolution.RSolutionId> {
    @EmbeddedId
    private RSolutionId id;

    @MapsId("questionId")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private RQuestion question;
    @MapsId("raterId")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private Rater rater;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private RSolutionValue solution;

    @Embeddable
    @Data
    public static class RSolutionId implements Serializable {
        private Long questionId;
        private UUID raterId;
    }
}
