package com.ntd.unipassau.codeannotation.domain.rater;

import com.ntd.unipassau.codeannotation.domain.AbstractAuditingEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "rater_action")
@Setter
@Getter
@ToString
public class RaterAction extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns(value = {
            @JoinColumn(name = "rater_id", referencedColumnName = "rater_id"),
            @JoinColumn(name = "dataset_id", referencedColumnName = "dataset_id")
    }, foreignKey = @ForeignKey(name = "rater_action_datasetFK"))
    @ToString.Exclude
    private RaterDataset raterDataset;

    @Column(name = "dataset_id", insertable = false, updatable = false)
    private Long datasetId;

    @Column(name = "rater_id", insertable = false, updatable = false)
    private UUID raterId;
}
