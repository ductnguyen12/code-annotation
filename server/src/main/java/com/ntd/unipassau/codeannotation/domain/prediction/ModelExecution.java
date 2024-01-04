package com.ntd.unipassau.codeannotation.domain.prediction;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import com.ntd.unipassau.codeannotation.domain.RequestState;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Entity
@Table(name = "model_execution")
@Setter
@Getter
@ToString
public class ModelExecution extends AbstractAuditingEntity<UUID> {
    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    private PredictionTarget targetType;

    private Long targetId;

    @Column(nullable = false)
    private Long modelId;

    @Enumerated(EnumType.STRING)
    private RequestState state = RequestState.PENDING;

    @Column(columnDefinition = "text")
    private String errorMsg;
}
